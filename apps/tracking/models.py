from datetime import timedelta, datetime, time

from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.staff.models import Staff, Absenteeism


# Create your models here.

class Tracking(models.Model):
    class Meta:
        verbose_name = 'Asistencias'
        verbose_name_plural = 'Asistencias'
        db_table = 'attendance'
        ordering = ['-date', 'staff__name']

    staff = models.ForeignKey(Staff, on_delete=models.PROTECT, verbose_name='Personal', related_name='tracking_staff')
    date = models.DateField(verbose_name='Fecha', blank=True, null=True)
    check_in = models.DateTimeField(verbose_name='Hora de entrada', blank=True, null=True, )
    lunch_start = models.DateTimeField(verbose_name='Inicio de almuerzo', blank=True, null=True, )
    lunch_end = models.DateTimeField(verbose_name='Fin de almuerzo', blank=True, null=True, )
    check_out = models.DateTimeField(verbose_name='Hora de salida', blank=True, null=True, )
    absenteeism = models.ForeignKey(Absenteeism, on_delete=models.PROTECT, verbose_name='Ausentismo',
                                    related_name='tracking_absenteeism', blank=True, null=True)
    absenteeism_hours = models.TimeField(verbose_name='Horas de ausentismo', blank=True, null=True, default='00:00:00')
    absenteeism_extra = models.ForeignKey(Absenteeism, on_delete=models.PROTECT,
                                          verbose_name='Ausentismo extraordinario',
                                          related_name='tracking_absenteeism_extra', blank=True, null=True)
    absenteeism_hours_extra = models.TimeField(verbose_name='Horas de ausentismo extraordinario', blank=True, null=True,
                                               default='00:00:00')
    # Campos para horas trabajadas y extras
    worked_hours = models.DurationField(verbose_name='Horas trabajadas', blank=True, null=True)
    overtime_25_hours = models.TimeField(verbose_name='Horas extras 25%', blank=True, null=True, default='00:00:00')
    overtime_35_hours = models.TimeField(verbose_name='Horas extras 35%', blank=True, null=True, default='00:00:00')

    # delay_hours = models.TimeField(verbose_name='Horas de retraso', blank=True, null=True, default='00:00:00')
    #
    # approved = models.BooleanField(verbose_name='Aprobado', default=False)

    # Campo para indicar si es horario diurno o nocturno
    is_day_shift = models.BooleanField(verbose_name='Horario día/noche', default=True)

    def __str__(self):
        if self.date:
            return f'{self.staff} - {self.date}'
        else:
            return f'{self.staff}'

    def round_check_in(self):
        if self.check_in:
            minute = self.check_in.minute
            if minute > 20:
                # Redondear hacia arriba a la hora siguiente
                self.check_in = self.check_in.replace(hour=self.check_in.hour + 1, minute=0)
                self.delay_hours = self.delay_hours.replace(hour=0, minute=0)
            else:
                self.delay_hours = self.delay_hours.replace(hour=0, minute=minute)

    def save(self, force_insert=False, force_update=False, using=None, update_fields=None):
        self.worked_hours = timedelta(hours=0)
        if self.check_in:
            if 5 <= self.check_in.hour < 18:
                self.is_day_shift = True
            else:
                self.is_day_shift = False

        if self.check_in and self.check_out:
            time_worked = self.check_out - self.check_in
            if self.lunch_start and self.lunch_end:
                lunch_time = self.lunch_end - self.lunch_start
                time_worked -= lunch_time
            self.worked_hours = time_worked

        if self.check_in:
            self.date = self.check_in.date()

        if self.absenteeism and self.absenteeism_hours:
            absenteeism_seconds = (
                    self.absenteeism_hours.hour * 3600 + self.absenteeism_hours.minute * 60 + self.absenteeism_hours.second)
            self.worked_hours += timedelta(seconds=absenteeism_seconds)

        if self.absenteeism_extra and self.absenteeism_hours_extra:
            absenteeism_extra_seconds = (
                    self.absenteeism_hours_extra.hour * 3600 + self.absenteeism_hours_extra.minute * 60 + self.absenteeism_hours_extra.second)
            self.worked_hours += timedelta(seconds=absenteeism_extra_seconds)

        if self.worked_hours > timedelta(hours=8):
            overtime_hours = self.worked_hours - timedelta(hours=8)
            overtime_25_hours = min(timedelta(hours=2), overtime_hours)
            overtime_35_hours = max(timedelta(0), overtime_hours - timedelta(hours=2))

            # Crear objetos datetime completos con una fecha mínima
            datetime_min = datetime.min
            overtime_25_datetime = datetime_min + overtime_25_hours
            overtime_35_datetime = datetime_min + overtime_35_hours

            # Extraer la parte de tiempo de los objetos datetime
            self.overtime_25_hours = overtime_25_datetime.time()
            self.overtime_35_hours = overtime_35_datetime.time()
            self.worked_hours = timedelta(hours=8)
        else:
            self.overtime_25_hours = time(0)
            self.overtime_35_hours = time(0)

        if self.absenteeism:
            if self.absenteeism.name == 'Inasistencia' or self.absenteeism.name == 'Suspensión' or self.absenteeism.name == 'Descanso semanal' or self.absenteeism.name == 'Descanso feriado':
                self.overtime_25_hours = time(0)
                self.overtime_35_hours = time(0)
                self.worked_hours = timedelta(hours=0)

        super().save(force_insert, force_update, using, update_fields)


# @receiver(post_save, sender=Tracking)
# def update_delay(sender, instance, **kwargs):
#     try:
#         minute = instance.check_in.minute
#         if minute > 20:
#             instance.check_in = instance.check_in.replace(hour=instance.check_in.hour + 1, minute=0)
#             instance.delay_hours = instance.delay_hours.replace(hour=0, minute=0)
#         else:
#             instance.delay_hours = instance.delay_hours.replace(hour=0, minute=minute)
#         Tracking.objects.filter(pk=instance.pk).update(check_in=instance.check_in, delay_hours=instance.delay_hours)
#
#     except Exception as e:
#         pass


class Holiday(models.Model):
    class Meta:
        verbose_name = 'Feriado'
        verbose_name_plural = 'Feriados'
        db_table = 'holidays'
        ordering = ['date']

    date = models.DateField(verbose_name='Fecha', blank=True, null=True)
    name = models.CharField(verbose_name='Nombre', max_length=100, blank=True, null=True)

    def __str__(self):
        return f'{self.name} - {self.date}'
