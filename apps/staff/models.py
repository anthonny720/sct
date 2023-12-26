import uuid

from django.db import models
from simple_history.models import HistoricalRecords


# Create your models here.
class Department(models.Model):
    class Meta:
        verbose_name = 'Departamento'
        verbose_name_plural = 'Departamentos'

    name = models.CharField(max_length=255, verbose_name='Nombre')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Creado el')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Actualizado el')
    history = HistoricalRecords()

    def __str__(self):
        return self.name

    def get_staff(self):
        if self.staff_area.all().count() > 0:
            return [{'name': staff.name, 'last_name': staff.last_name, 'position': staff.position,
                     'area': staff.area.name, } for staff in self.staff_area.all()]
        else:
            return []


class Absenteeism(models.Model):
    class Meta:
        verbose_name = 'Ausentismo'
        verbose_name_plural = 'Ausentismos'
        ordering = ['name']

    name = models.CharField(max_length=50, verbose_name='Nombre')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Creado el')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Actualizado el')
    history = HistoricalRecords()

    def __str__(self):
        return self.name


class Staff(models.Model):
    class Meta:
        verbose_name = 'Personal'
        verbose_name_plural = 'Personal'
        ordering = ['last_name', 'name']

    name = models.CharField(max_length=100, verbose_name='Nombre')
    last_name = models.CharField(max_length=100, verbose_name='Apellido')
    full_name = models.CharField(max_length=100, verbose_name='Nombre completo', blank=True, null=True)
    dni = models.CharField(max_length=8, verbose_name='DNI')
    uuid = models.CharField(editable=True, unique=True, verbose_name='UUID',max_length=15, blank=True, null=True)
    email = models.EmailField(verbose_name='Correo electrónico', blank=True, null=True)
    status = models.BooleanField(default=True, verbose_name='Estado')
    phone = models.CharField(max_length=10, verbose_name='Teléfono')
    position = models.CharField(max_length=50, verbose_name='Cargo')
    birthday = models.DateField(verbose_name='Fecha de nacimiento', blank=True, null=True)
    date_of_admission = models.DateField(verbose_name='Fecha de ingreso', blank=True, null=True)
    date_of_farewell = models.DateField(verbose_name='Fecha de salida', blank=True, null=True)
    area = models.ForeignKey(Department, on_delete=models.PROTECT, verbose_name='Área', related_name='staff_area')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Creado el')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Actualizado el')
    overtime_hours = models.DurationField(verbose_name='Horas extras', blank=True, null=True, default='00:00:00')
    history = HistoricalRecords()

    def __str__(self):
        return self.name + ' ' + self.last_name

    def get_full_name(self):
        return self.last_name + ' ' + self.name

    def save(self, force_insert=False, force_update=False, using=None, update_fields=None):
        self.full_name = self.last_name + ' ' + self.name
        if not self.uuid:  # Si no hay UUID asignado, generarlo
            unique_seed = f"{self.dni}{self.full_name}"
            generated_uuid = uuid.uuid5(uuid.NAMESPACE_DNS, unique_seed)
            self.uuid = str(generated_uuid)[0:15]
        if self.uuid:
            pass

        super(Staff, self).save()
