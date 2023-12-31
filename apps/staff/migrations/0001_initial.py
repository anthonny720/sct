# Generated by Django 4.2.4 on 2023-12-27 21:17

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import simple_history.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Absenteeism',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, verbose_name='Nombre')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Creado el')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Actualizado el')),
            ],
            options={
                'verbose_name': 'Ausentismo',
                'verbose_name_plural': 'Ausentismos',
                'ordering': ['name'],
            },
        ),
        migrations.CreateModel(
            name='Department',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, verbose_name='Nombre')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Creado el')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Actualizado el')),
            ],
            options={
                'verbose_name': 'Departamento',
                'verbose_name_plural': 'Departamentos',
            },
        ),
        migrations.CreateModel(
            name='Staff',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, verbose_name='Nombre')),
                ('last_name', models.CharField(max_length=100, verbose_name='Apellido')),
                ('full_name', models.CharField(blank=True, max_length=100, null=True, verbose_name='Nombre completo')),
                ('dni', models.CharField(max_length=8, verbose_name='DNI')),
                ('uuid', models.CharField(blank=True, max_length=15, null=True, unique=True, verbose_name='UUID')),
                ('email', models.EmailField(blank=True, max_length=254, null=True, verbose_name='Correo electrónico')),
                ('status', models.BooleanField(default=True, verbose_name='Estado')),
                ('phone', models.CharField(max_length=10, verbose_name='Teléfono')),
                ('position', models.CharField(max_length=50, verbose_name='Cargo')),
                ('birthday', models.DateField(blank=True, null=True, verbose_name='Fecha de nacimiento')),
                ('date_of_admission', models.DateField(blank=True, null=True, verbose_name='Fecha de ingreso')),
                ('date_of_farewell', models.DateField(blank=True, null=True, verbose_name='Fecha de salida')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Creado el')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Actualizado el')),
                ('overtime_hours', models.DurationField(blank=True, default='00:00:00', null=True, verbose_name='Horas extras')),
                ('area', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='staff_area', to='staff.department', verbose_name='Área')),
            ],
            options={
                'verbose_name': 'Personal',
                'verbose_name_plural': 'Personal',
                'ordering': ['last_name', 'name'],
            },
        ),
        migrations.CreateModel(
            name='HistoricalStaff',
            fields=[
                ('id', models.BigIntegerField(auto_created=True, blank=True, db_index=True, verbose_name='ID')),
                ('name', models.CharField(max_length=100, verbose_name='Nombre')),
                ('last_name', models.CharField(max_length=100, verbose_name='Apellido')),
                ('full_name', models.CharField(blank=True, max_length=100, null=True, verbose_name='Nombre completo')),
                ('dni', models.CharField(max_length=8, verbose_name='DNI')),
                ('uuid', models.CharField(blank=True, db_index=True, max_length=15, null=True, verbose_name='UUID')),
                ('email', models.EmailField(blank=True, max_length=254, null=True, verbose_name='Correo electrónico')),
                ('status', models.BooleanField(default=True, verbose_name='Estado')),
                ('phone', models.CharField(max_length=10, verbose_name='Teléfono')),
                ('position', models.CharField(max_length=50, verbose_name='Cargo')),
                ('birthday', models.DateField(blank=True, null=True, verbose_name='Fecha de nacimiento')),
                ('date_of_admission', models.DateField(blank=True, null=True, verbose_name='Fecha de ingreso')),
                ('date_of_farewell', models.DateField(blank=True, null=True, verbose_name='Fecha de salida')),
                ('created_at', models.DateTimeField(blank=True, editable=False, verbose_name='Creado el')),
                ('updated_at', models.DateTimeField(blank=True, editable=False, verbose_name='Actualizado el')),
                ('overtime_hours', models.DurationField(blank=True, default='00:00:00', null=True, verbose_name='Horas extras')),
                ('history_id', models.AutoField(primary_key=True, serialize=False)),
                ('history_date', models.DateTimeField(db_index=True)),
                ('history_change_reason', models.CharField(max_length=100, null=True)),
                ('history_type', models.CharField(choices=[('+', 'Created'), ('~', 'Changed'), ('-', 'Deleted')], max_length=1)),
                ('area', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='staff.department', verbose_name='Área')),
                ('history_user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'historical Personal',
                'verbose_name_plural': 'historical Personal',
                'ordering': ('-history_date', '-history_id'),
                'get_latest_by': ('history_date', 'history_id'),
            },
            bases=(simple_history.models.HistoricalChanges, models.Model),
        ),
        migrations.CreateModel(
            name='HistoricalDepartment',
            fields=[
                ('id', models.BigIntegerField(auto_created=True, blank=True, db_index=True, verbose_name='ID')),
                ('name', models.CharField(max_length=255, verbose_name='Nombre')),
                ('created_at', models.DateTimeField(blank=True, editable=False, verbose_name='Creado el')),
                ('updated_at', models.DateTimeField(blank=True, editable=False, verbose_name='Actualizado el')),
                ('history_id', models.AutoField(primary_key=True, serialize=False)),
                ('history_date', models.DateTimeField(db_index=True)),
                ('history_change_reason', models.CharField(max_length=100, null=True)),
                ('history_type', models.CharField(choices=[('+', 'Created'), ('~', 'Changed'), ('-', 'Deleted')], max_length=1)),
                ('history_user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'historical Departamento',
                'verbose_name_plural': 'historical Departamentos',
                'ordering': ('-history_date', '-history_id'),
                'get_latest_by': ('history_date', 'history_id'),
            },
            bases=(simple_history.models.HistoricalChanges, models.Model),
        ),
        migrations.CreateModel(
            name='HistoricalAbsenteeism',
            fields=[
                ('id', models.BigIntegerField(auto_created=True, blank=True, db_index=True, verbose_name='ID')),
                ('name', models.CharField(max_length=50, verbose_name='Nombre')),
                ('created_at', models.DateTimeField(blank=True, editable=False, verbose_name='Creado el')),
                ('updated_at', models.DateTimeField(blank=True, editable=False, verbose_name='Actualizado el')),
                ('history_id', models.AutoField(primary_key=True, serialize=False)),
                ('history_date', models.DateTimeField(db_index=True)),
                ('history_change_reason', models.CharField(max_length=100, null=True)),
                ('history_type', models.CharField(choices=[('+', 'Created'), ('~', 'Changed'), ('-', 'Deleted')], max_length=1)),
                ('history_user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'historical Ausentismo',
                'verbose_name_plural': 'historical Ausentismos',
                'ordering': ('-history_date', '-history_id'),
                'get_latest_by': ('history_date', 'history_id'),
            },
            bases=(simple_history.models.HistoricalChanges, models.Model),
        ),
    ]
