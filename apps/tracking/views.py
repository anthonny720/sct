from datetime import datetime, date

from django.db import DatabaseError
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.staff.models import Staff
from apps.tracking.models import Tracking, Holiday
from apps.tracking.serializers import TrackingSerializer


# Create your views here.
class TrackingListView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            model = Tracking.objects.all()
            user = self.request.query_params.get('user', None)
            date = self.request.query_params.get('date', None)
            department = self.request.query_params.get('department', None)
            if user:
                model = model.filter(staff__full_name__icontains=user)
            if department:
                model = model.filter(staff__area__id=department)
            if date:
                model = model.filter(date=datetime.strptime(date, '%Y-%m-%d'))
            else:
                model = model.filter(date=datetime.now())

            serializer = TrackingSerializer(model, many=True)
            return Response({'data': serializer.data}, status=status.HTTP_200_OK)
        except DatabaseError as e:
            error_message = 'No se puede procesar su solicitud debido a un error de base de datos. Por favor, inténtelo de nuevo más tarde.'
            return Response({'message': error_message, 'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            error_message = 'Se ha producido un error inesperado en el servidor. Por favor, inténtelo de nuevo más tarde.'
            return Response({'message': error_message, 'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request, *args, **kwargs):
        try:
            serializer = TrackingSerializer(data=self.request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response({'message': 'Se ha registro correctamente', 'data': serializer.data},
                            status=status.HTTP_201_CREATED)
        except DatabaseError as e:
            error_message = 'No se puede procesar su solicitud debido a un error de base de datos. Por favor, inténtelo de nuevo más tarde.'
            return Response({'message': error_message, 'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            error_message = 'Se ha producido un error inesperado en el servidor. Por favor, inténtelo de nuevo más tarde.'
            return Response({'message': error_message, 'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class TrackingDetailView(APIView):

    def patch(self, request, id, *args, **kwargs):
        try:
            data = request.data
            obj = get_object_or_404(Tracking, pk=id)
            serializer = TrackingSerializer(obj, data=data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response({'message': 'Se ha actualizado correctamente', 'data': serializer.data},
                            status=status.HTTP_200_OK)
        except DatabaseError as e:
            error_message = 'No se puede procesar su solicitud debido a un error de base de datos. Por favor, inténtelo de nuevo más tarde.'
            return Response({'message': error_message, 'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            error_message = 'Se ha producido un error inesperado en el servidor. Por favor, inténtelo de nuevo más tarde.'
            return Response({'message': error_message, 'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ScannerTrackingView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            code = str(data['code']).strip()
            category = data['attendance'].strip()

            if len(code) != 8:
                return Response({'message': 'El codigo  es invalido'}, status=status.HTTP_400_BAD_REQUEST)
            try:
                user = Staff.objects.get(uuid=code)
            except Staff.DoesNotExist:
                return Response({'message': 'No existe el usuario'}, status=status.HTTP_404_NOT_FOUND)

            tracking_exists = Tracking.objects.filter(staff=user, date=date.today()).first()

            last_tracking = Tracking.objects.filter(staff=user).order_by('-date').first()

            if last_tracking is not None:
                if last_tracking.date:
                    if last_tracking.date != date.today():
                        if last_tracking.absenteeism:
                            pass
                        else:
                            if last_tracking.check_out is None:
                                if last_tracking.is_day_shift == False:
                                    if category == 'lunch_start':
                                        if last_tracking.lunch_start is None:
                                            last_tracking.lunch_start = timezone.now()
                                            last_tracking.save()
                                            serializer = TrackingSerializer(last_tracking, many=False)
                                            return Response({'message': 'Se ha registrado el inicio de almuerzo',
                                                             'data': serializer.data}, status=status.HTTP_201_CREATED)
                                        else:
                                            return Response({'message': 'Ya existe un registro de inicio de almuerzo'},
                                                            status=status.HTTP_400_BAD_REQUEST)
                                    elif category == 'lunch_end':
                                        if last_tracking.lunch_start is None:
                                            return Response({'message': 'Primero debe registrar el inicio de almuerzo'},
                                                            status=status.HTTP_400_BAD_REQUEST)
                                        elif last_tracking.lunch_end is None:
                                            last_tracking.lunch_end = timezone.now()
                                            last_tracking.save()
                                            serializer = TrackingSerializer(last_tracking, many=False)
                                            return Response({'message': 'Se ha registrado el fin de almuerzo',
                                                             'data': serializer.data}, status=status.HTTP_201_CREATED)
                                        else:
                                            return Response({'message': 'Ya existe un registro de fin de almuerzo'},
                                                            status=status.HTTP_400_BAD_REQUEST)
                                    elif category == 'check_out':
                                        if last_tracking.lunch_end is None:
                                            return Response({'message': 'Primero debe registrar el fin de almuerzo '},
                                                            status=status.HTTP_400_BAD_REQUEST)
                                        elif last_tracking.check_out is None:
                                            last_tracking.check_out = timezone.now()
                                            last_tracking.save()
                                            serializer = TrackingSerializer(last_tracking, many=False)
                                            return Response({'message': 'Se ha registrado la salida del usuario',
                                                             'data': serializer.data}, status=status.HTTP_201_CREATED)
                                        else:
                                            return Response({'message': 'Ya existe un registro de salida'},
                                                            status=status.HTTP_400_BAD_REQUEST)
                                    else:
                                        return Response({'message': 'Ya existe un registro de ingreso'},
                                                        status=status.HTTP_400_BAD_REQUEST)
                                else:
                                    last_tracking.check_out = timezone.now()
                                    last_tracking.save()
            if category == 'check_in':
                if not tracking_exists:
                    tracking = Tracking(staff=user, check_in=timezone.now())
                    tracking.save()
                    serializer = TrackingSerializer(tracking, many=False)
                    return Response({'message': 'Se ha registrado la marcación del usuario', 'data': serializer.data},
                                    status=status.HTTP_201_CREATED)
                else:
                    return Response({'message': 'Ya existe un registro de ingreso'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                if tracking_exists is None or tracking_exists.check_in is None:
                    return Response({'message': 'Primero debe registrar su ingreso'},
                                    status=status.HTTP_400_BAD_REQUEST)
                elif category == 'lunch_start':
                    if tracking_exists.lunch_start is None:
                        tracking_exists.lunch_start = timezone.now()
                        tracking_exists.save()
                        serializer = TrackingSerializer(tracking_exists, many=False)
                        return Response({'message': 'Se ha registrado el inicio de almuerzo', 'data': serializer.data},
                                        status=status.HTTP_201_CREATED)
                    else:
                        return Response({'message': 'Ya existe un registro de inicio de almuerzo'},
                                        status=status.HTTP_400_BAD_REQUEST)
                elif category == 'lunch_end':
                    if tracking_exists.lunch_start is None:
                        return Response({'message': 'Primero debe registrar el inicio de almuerzo'},
                                        status=status.HTTP_400_BAD_REQUEST)
                    elif tracking_exists.lunch_end is None:
                        tracking_exists.lunch_end = timezone.now()
                        tracking_exists.save()
                        serializer = TrackingSerializer(tracking_exists, many=False)
                        return Response({'message': 'Se ha registrado el fin de almuerzo', 'data': serializer.data},
                                        status=status.HTTP_201_CREATED)
                    else:
                        return Response({'message': 'Ya existe un registro de fin de almuerzo'},
                                        status=status.HTTP_400_BAD_REQUEST)
                elif category == 'check_out':
                    if tracking_exists.lunch_end is None:
                        return Response({'message': 'Primero debe registrar el fin de almuerzo '},
                                        status=status.HTTP_400_BAD_REQUEST)
                    elif tracking_exists.check_out is None:
                        tracking_exists.check_out = timezone.now()
                        tracking_exists.save()
                        serializer = TrackingSerializer(tracking_exists, many=False)
                        return Response({'message': 'Se ha registrado la salida del usuario', 'data': serializer.data},
                                        status=status.HTTP_201_CREATED)
                    else:
                        return Response({'message': 'Ya existe un registro de salida'},
                                        status=status.HTTP_400_BAD_REQUEST)
                else:
                    return Response({'message': 'No existe la categoría de marcación'},
                                    status=status.HTTP_400_BAD_REQUEST)

        except DatabaseError as e:
            error_message = 'No se puede procesar su solicitud debido a un error de base de datos. Por favor, inténtelo de nuevo más tarde.'
            return Response({'message': str(e), 'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            error_message = 'Se ha producido un error inesperado en el servidor. Por favor, inténtelo de nuevo más tarde.'
            return Response({'message': str(e), 'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SummaryView(APIView):
    def get(self, request, *args, **kwargs):
        try:

            start_date_str = request.query_params.get('start_date')
            end_date_str = request.query_params.get('end_date')
            department = request.query_params.get('department')
            user = request.query_params.get('user')

            start_date = timezone.datetime.strptime(start_date_str, '%Y-%m-%d').date()
            end_date = timezone.datetime.strptime(end_date_str, '%Y-%m-%d').date()
            # Filtrar registros de asistencia dentro del rango de fechas
            attendances = Tracking.objects.filter(date__range=[start_date, end_date])

            if user:
                users = Staff.objects.filter(full_name__icontains=user)
            else:
                users = Staff.objects.filter(trusted=False)
            if department:
                users = users.filter(area__id=department)

            summary = []

            for user in users:
                if user.date_of_farewell and user.date_of_farewell < start_date:
                    continue

                user_summary = {'user': user.get_full_name(), 'overtime_25': timedelta(hours=0),
                                'overtime_35': timedelta(hours=0), 'total_worked_night': timedelta(hours=0),
                                'total_days_worked': 0, 'inasistencia': 0, 'descanso_semanal': 0,
                                'licencia_sin_gose_de_haber': 0, 'vacaciones': 0, 'descanso_medico': 0, }

                for attendance in attendances.filter(staff=user):
                    if attendance.worked_hours and attendance.worked_hours.total_seconds() / 3600 > 1:
                        user_summary['total_days_worked'] += 1

                    if attendance.absenteeism:
                        if attendance.absenteeism.name == 'Inasistencia' or attendance.absenteeism.name == 'Suspensión' or attendance.absenteeism.name == 'Descanso médico' or attendance.absenteeism.name == 'Licencia sin gose de haber' or attendance.absenteeism.name == 'Vacaciones':
                            user_summary['total_days_worked'] -= 1
                    if attendance.absenteeism:
                        if attendance.absenteeism and attendance.absenteeism.name == 'Inasistencia' or attendance.absenteeism.name == 'Suspensión':
                            user_summary['inasistencia'] += 1
                        if attendance.absenteeism and attendance.absenteeism.name == 'Descanso semanal':
                            user_summary['descanso_semanal'] += 1
                        if attendance.absenteeism and attendance.absenteeism.name == 'CONADIS':
                            user_summary['descanso_semanal'] += 1
                        if attendance.absenteeism and attendance.absenteeism.name == 'Descanso feriado':
                            user_summary['descanso_semanal'] += 1
                        if attendance.absenteeism and attendance.absenteeism.name == 'Descanso colaborador mes':
                            user_summary['descanso_semanal'] += 1
                        if attendance.absenteeism and attendance.absenteeism.name == 'Licencia sin gose de haber':
                            user_summary['licencia_sin_gose_de_haber'] += 1
                        if attendance.absenteeism and attendance.absenteeism.name == 'Descanso médico':
                            user_summary['descanso_medico'] += 1
                        if attendance.absenteeism and attendance.absenteeism.name == 'Vacaciones':
                            user_summary['vacaciones'] += 1
                    if attendance.approved:
                        user_summary['overtime_25'] += timedelta(hours=attendance.overtime_25_hours.hour,
                                                                 minutes=attendance.overtime_25_hours.minute,
                                                                 seconds=attendance.overtime_25_hours.second)

                        user_summary['overtime_35'] += timedelta(hours=attendance.overtime_35_hours.hour,
                                                                 minutes=attendance.overtime_35_hours.minute,
                                                                 seconds=attendance.overtime_35_hours.second)

                    user_summary[
                        'total_worked_night'] += attendance.worked_hours if not attendance.is_day_shift else timedelta(
                        hours=0)

                # Formatear las duraciones de tiempo en hh:mm
                user_summary['overtime_25'] = str(timedelta(hours=user_summary['overtime_25'].seconds // 3600,
                                                            minutes=(user_summary['overtime_25'].seconds // 60) % 60))

                user_summary['overtime_35'] = str(timedelta(hours=user_summary['overtime_35'].seconds // 3600,
                                                            minutes=(user_summary['overtime_35'].seconds // 60) % 60))
                total_worked_night_seconds = user_summary['total_worked_night'].total_seconds()
                total_worked_night_hours = int(total_worked_night_seconds // 3600)
                total_worked_night_minutes = int((total_worked_night_seconds // 60) % 60)
                user_summary['total_worked_night'] = f"{total_worked_night_hours:02d}:{total_worked_night_minutes:02d}"

                summary.append(user_summary)

            return Response({'data': summary}, status=status.HTTP_200_OK)
        except DatabaseError as e:
            error_message = 'No se puede procesar su solicitud debido a un error de base de datos. Por favor, inténtelo de nuevo más tarde.'
            return Response({'message': error_message, 'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            error_message = 'Se ha producido un error inesperado en el servidor. Por favor, inténtelo de nuevo más tarde.'
            return Response({'message': error_message, 'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class OutsourcingView(APIView):
    def get(self, request, *args, **kwargs):
        try:

            start_date_str = request.query_params.get('start_date')
            end_date_str = request.query_params.get('end_date')

            start_date = timezone.datetime.strptime(start_date_str, '%Y-%m-%d').date()
            end_date = timezone.datetime.strptime(end_date_str, '%Y-%m-%d').date()
            # Filtrar registros de asistencia dentro del rango de fechas
            attendances = Tracking.objects.filter(date__range=[start_date, end_date])

            users = Staff.objects.filter(trusted=False)

            summary = []

            for user in users:
                if user.date_of_farewell and user.date_of_farewell < start_date:
                    continue

                user_summary = {'user': user.get_full_name(), 'dni': user.dni, 'position': user.position,
                                'out': user.date_of_farewell, 'overtime_25': timedelta(hours=0),
                                'overtime_35': timedelta(hours=0), 'total_worked_night': timedelta(hours=0),
                                'total_days_worked': 0, 'inasistencia': 0, 'descanso_semanal': 0,
                                'licencia_sin_gose_de_haber': 0, 'vacaciones': 0, 'descanso_medico': 0, 'feriado': 0,
                                'dias_inasistencia': [], 'dias_licencia_sin_gose_de_haber': [], 'dias_vacaciones': [],
                                'dias_descanso_medico': [], 'dias_feriado': [], 'horas_feriado': timedelta(hours=0),
                                'compensación_feriados': timedelta(hours=0)}

                for attendance in attendances.filter(staff=user):
                    if attendance.worked_hours and attendance.worked_hours.total_seconds() / 3600 > 1:
                        user_summary['total_days_worked'] += 1

                    if attendance.absenteeism:
                        if attendance.absenteeism.name == 'Inasistencia' or attendance.absenteeism.name == 'Suspensión' or attendance.absenteeism.name == 'Descanso médico' or attendance.absenteeism.name == 'Licencia sin gose de haber' or attendance.absenteeism.name == 'Vacaciones':
                            if attendance.worked_hours and attendance.worked_hours.total_seconds() / 3600 > 1:
                                user_summary['total_days_worked'] -= 1
                    if attendance.absenteeism:
                        if attendance.absenteeism and attendance.absenteeism.name == 'Inasistencia' or attendance.absenteeism.name == 'Suspensión':
                            user_summary['dias_inasistencia'] += [attendance.date.strftime('%d/%m')]
                            user_summary['inasistencia'] += 1
                        if attendance.absenteeism and attendance.absenteeism.name == 'Descanso semanal':
                            user_summary['descanso_semanal'] += 1
                        if attendance.absenteeism and attendance.absenteeism.name == 'CONADIS':
                            user_summary['descanso_semanal'] += 1
                        if attendance.absenteeism and attendance.absenteeism.name == 'Descanso feriado':
                            user_summary['descanso_semanal'] += 1
                        if attendance.absenteeism and attendance.absenteeism.name == 'Descanso colaborador mes':
                            user_summary['descanso_semanal'] += 1
                        if attendance.absenteeism and attendance.absenteeism.name == 'Licencia sin gose de haber':
                            user_summary['dias_licencia_sin_gose_de_haber'] += [attendance.date.strftime('%d/%m')]
                            user_summary['licencia_sin_gose_de_haber'] += 1
                        if attendance.absenteeism and attendance.absenteeism.name == 'Descanso médico':
                            user_summary['dias_descanso_medico'] += [attendance.date.strftime('%d/%m')]
                            user_summary['descanso_medico'] += 1
                        if attendance.absenteeism and attendance.absenteeism.name == 'Vacaciones':
                            user_summary['dias_vacaciones'] += [attendance.date.strftime('%d/%m')]
                            user_summary['vacaciones'] += 1

                        if attendance.absenteeism and attendance.absenteeism.name == 'Compensación feriados':
                            user_summary['compensación_feriados'] += timedelta(hours=attendance.absenteeism_hours.hour,
                                                                               minutes=attendance.absenteeism_hours.minute,
                                                                               seconds=attendance.absenteeism_hours.second)
                            total_compensation_holiday_seconds = user_summary['compensación_feriados'].total_seconds()
                            total_compensation_holiday_hours = int(total_compensation_holiday_seconds // 3600)
                            total_compensation_holiday_minutes = int((total_compensation_holiday_seconds // 60) % 60)
                            user_summary[
                                'compensación_feriados'] = f"{total_compensation_holiday_hours:02d}:{total_compensation_holiday_minutes:02d}"

                    holiday = Holiday.objects.filter(date=attendance.date).first()
                    if holiday:
                        if attendance.worked_hours and attendance.worked_hours.total_seconds() / 3600 > 1:
                            user_summary['dias_feriado'] += [attendance.date.strftime('%d/%m')]
                            user_summary['feriado'] += 1
                            user_summary['horas_feriado'] += attendance.worked_hours

                            total_worked_holiday_seconds = user_summary['horas_feriado'].total_seconds()
                            total_worked_holiday_hours = int(total_worked_holiday_seconds // 3600)
                            total_worked_holiday_minutes = int((total_worked_holiday_seconds // 60) % 60)
                            user_summary[
                                'horas_feriado'] = f"{total_worked_holiday_hours:02d}:{total_worked_holiday_minutes:02d}"

                    if attendance.approved:
                        user_summary['overtime_25'] += timedelta(hours=attendance.overtime_25_hours.hour,
                                                                 minutes=attendance.overtime_25_hours.minute,
                                                                 seconds=attendance.overtime_25_hours.second)

                        user_summary['overtime_35'] += timedelta(hours=attendance.overtime_35_hours.hour,
                                                                 minutes=attendance.overtime_35_hours.minute,
                                                                 seconds=attendance.overtime_35_hours.second)

                    user_summary[
                        'total_worked_night'] += attendance.worked_hours if not attendance.is_day_shift else timedelta(
                        hours=0)

                # Formatear las duraciones de tiempo en hh:mm
                user_summary['overtime_25'] = str(timedelta(hours=user_summary['overtime_25'].seconds // 3600,
                                                            minutes=(user_summary['overtime_25'].seconds // 60) % 60))

                user_summary['overtime_35'] = str(timedelta(hours=user_summary['overtime_35'].seconds // 3600,
                                                            minutes=(user_summary['overtime_35'].seconds // 60) % 60))
                total_worked_night_seconds = user_summary['total_worked_night'].total_seconds()
                total_worked_night_hours = int(total_worked_night_seconds // 3600)
                total_worked_night_minutes = int((total_worked_night_seconds // 60) % 60)
                user_summary['total_worked_night'] = f"{total_worked_night_hours:02d}:{total_worked_night_minutes:02d}"

                summary.append(user_summary)

            return Response({'data': summary}, status=status.HTTP_200_OK)
        except DatabaseError as e:
            error_message = 'No se puede procesar su solicitud debido a un error de base de datos. Por favor, inténtelo de nuevo más tarde.'
            return Response({'message': error_message, 'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            error_message = 'Se ha producido un error inesperado en el servidor. Por favor, inténtelo de nuevo más tarde.'
            return Response({'message': error_message, 'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


from datetime import timedelta


def format_time(time):
    # Formatear las horas trabajadas en el formato 00:00
    hours = int(time.total_seconds() // 3600)
    minutes = int((time.total_seconds() // 60) % 60)
    return f"{hours:02d}:{minutes:02d}"


class CalendarView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            start_date_str = request.query_params.get('start_date')
            end_date_str = request.query_params.get('end_date')
            department = request.query_params.get('department')
            user = request.query_params.get('user')

            start_date = timezone.datetime.strptime(start_date_str, '%Y-%m-%d').date()
            end_date = timezone.datetime.strptime(end_date_str, '%Y-%m-%d').date()

            if user:
                users = Staff.objects.filter(full_name__icontains=user)
            else:
                # Obtener todos los usuarios
                users = Staff.objects.filter(trusted=False)

            if department:
                users = users.filter(area__id=department)

            dates = []  # Lista de fechas en formato DD/MM
            users_summary = {}  # Diccionario con las horas trabajadas por usuario para cada fecha

            # Crear la lista de fechas
            current_date = start_date
            while current_date <= end_date:
                dates.append(current_date.strftime('%d/%m'))
                current_date += timedelta(days=1)

            # Recorrer todos los usuarios
            for user in users:
                if user.date_of_farewell and user.date_of_farewell < start_date:
                    continue

                users_summary[user.get_full_name()] = []

                # Recorrer todas las fechas y obtener las horas trabajadas
                current_date = start_date
                while current_date <= end_date:
                    # Obtener asistencias para el usuario y la fecha actual
                    attendances = Tracking.objects.filter(staff=user, date=current_date)

                    # Calcular las horas trabajadas para el usuario y la fecha actual
                    total_worked_hours = timedelta(hours=0)
                    total_delay_hours = timedelta(hours=0)
                    total_overtime_hours = timedelta(hours=0)
                    total_compensation = timedelta(hours=0)

                    for attendance in attendances:
                        if attendance.worked_hours and attendance.worked_hours.total_seconds() / 3600 > 1:
                            total_worked_hours += attendance.worked_hours
                        # sumar total de horas de tardanza si mi campo es TimeField y no tiene total_seconds()
                        if attendance.delay_hours:
                            total_delay_hours += timedelta(hours=attendance.delay_hours.hour,
                                                           minutes=attendance.delay_hours.minute,
                                                           seconds=attendance.delay_hours.second)

                        if attendance.approved:
                            total_overtime_hours += timedelta(hours=attendance.overtime_25_hours.hour,
                                                              minutes=attendance.overtime_25_hours.minute,
                                                              seconds=attendance.overtime_25_hours.second) + timedelta(
                                hours=attendance.overtime_35_hours.hour, minutes=attendance.overtime_35_hours.minute,
                                seconds=attendance.overtime_35_hours.second)

                        if attendance.absenteeism and attendance.absenteeism_hours:
                            if attendance.absenteeism.name == 'Compensación feriados':
                                total_compensation += timedelta(hours=attendance.absenteeism_hours.hour,
                                                                minutes=attendance.absenteeism_hours.minute,
                                                                seconds=attendance.absenteeism_hours.second)
                            if attendance.absenteeism.name == 'Compensación':
                                total_compensation += timedelta(hours=attendance.absenteeism_hours.hour,
                                                                minutes=attendance.absenteeism_hours.minute,
                                                                seconds=attendance.absenteeism_hours.second)
                        if attendance.absenteeism_extra and attendance.absenteeism_hours_extra:
                            if attendance.absenteeism_extra.name == 'Compensación feriados':
                                total_compensation += timedelta(hours=attendance.absenteeism_hours_extra.hour,
                                                                minutes=attendance.absenteeism_hours_extra.minute,
                                                                seconds=attendance.absenteeism_hours_extra.second)
                            if attendance.absenteeism_extra.name == 'Compensación':
                                total_compensation += timedelta(hours=attendance.absenteeism_hours_extra.hour,
                                                                minutes=attendance.absenteeism_hours_extra.minute,
                                                                seconds=attendance.absenteeism_hours_extra.second)
                    # Formatear las horas en el formato 00:00
                    formatted_hours = format_time(total_worked_hours)
                    formatted_delay_hours = format_time(total_delay_hours)
                    formatted_overtime_hours = format_time(total_overtime_hours)
                    formatted_compensation = format_time(total_compensation)
                    # Agregar las horas trabajadas al resumen del usuario
                    users_summary[user.get_full_name()].append(
                        {'worked_hours': formatted_hours if total_worked_hours.total_seconds() > 0 else "00:00",
                         'delay_hours': formatted_delay_hours if total_delay_hours.total_seconds() > 0 else "00:00",
                         'overtime_hours': formatted_overtime_hours if total_overtime_hours.total_seconds() > 0 else "00:00",
                         'compensation_hours': formatted_compensation if total_compensation.total_seconds() > 0 else "00:00", })
                    # Avanzar a la siguiente fecha
                    current_date += timedelta(days=1)
            data = {'date': dates, 'users': users_summary}
            return Response({'data': data}, status=status.HTTP_200_OK)
        except DatabaseError as e:
            error_message = 'No se puede procesar su solicitud debido a un error de base de datos. Por favor, inténtelo de nuevo más tarde.'
            return Response({'message': error_message, 'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            print(e)
            error_message = 'Se ha producido un error inesperado en el servidor. Por favor, inténtelo de nuevo más tarde.'
            return Response({'message': error_message, 'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
