# Generated by Django 4.2.4 on 2023-12-27 21:17

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('staff', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Holiday',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(blank=True, null=True, verbose_name='Fecha')),
                ('name', models.CharField(blank=True, max_length=100, null=True, verbose_name='Nombre')),
            ],
            options={
                'verbose_name': 'Feriado',
                'verbose_name_plural': 'Feriados',
                'db_table': 'holidays',
                'ordering': ['date'],
            },
        ),
        migrations.CreateModel(
            name='Tracking',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(blank=True, null=True, verbose_name='Fecha')),
                ('check_in', models.DateTimeField(blank=True, null=True, verbose_name='Hora de entrada')),
                ('lunch_start', models.DateTimeField(blank=True, null=True, verbose_name='Inicio de almuerzo')),
                ('lunch_end', models.DateTimeField(blank=True, null=True, verbose_name='Fin de almuerzo')),
                ('check_out', models.DateTimeField(blank=True, null=True, verbose_name='Hora de salida')),
                ('absenteeism_hours', models.TimeField(blank=True, default='00:00:00', null=True, verbose_name='Horas de ausentismo')),
                ('absenteeism_hours_extra', models.TimeField(blank=True, default='00:00:00', null=True, verbose_name='Horas de ausentismo extraordinario')),
                ('worked_hours', models.DurationField(blank=True, null=True, verbose_name='Horas trabajadas')),
                ('overtime_25_hours', models.TimeField(blank=True, default='00:00:00', null=True, verbose_name='Horas extras 25%')),
                ('overtime_35_hours', models.TimeField(blank=True, default='00:00:00', null=True, verbose_name='Horas extras 35%')),
                ('is_day_shift', models.BooleanField(default=True, verbose_name='Horario día/noche')),
                ('absenteeism', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='tracking_absenteeism', to='staff.absenteeism', verbose_name='Ausentismo')),
                ('absenteeism_extra', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='tracking_absenteeism_extra', to='staff.absenteeism', verbose_name='Ausentismo extraordinario')),
                ('staff', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='tracking_staff', to='staff.staff', verbose_name='Personal')),
            ],
            options={
                'verbose_name': 'Asistencias',
                'verbose_name_plural': 'Asistencias',
                'db_table': 'attendance',
                'ordering': ['-date', 'staff__name'],
            },
        ),
    ]