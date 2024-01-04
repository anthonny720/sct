from datetime import datetime

from django.db import DatabaseError
from django.db.models import ProtectedError
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.staff.models import Staff, Department, Absenteeism
from apps.staff.serializers import StaffSerializer, DepartmentSerializer, AbsenteeismSerializer
from apps.tracking.models import Tracking


# Create your views here.

class ListAbstractView(APIView):
    model = None
    serializer = None
    query_params = None

    def get_queryset(self):
        return self.model.objects.all()

    def get(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            filter_value = request.query_params.get(self.query_params, None)
            if filter_value:
                filter_kwargs = {f"{self.query_params}__icontains": filter_value}
                queryset = queryset.filter(**filter_kwargs)
            serializer = self.serializer(queryset, many=True)
            return Response({'data': serializer.data}, status=status.HTTP_200_OK)
        except DatabaseError as e:
            error_message = 'No se puede procesar su solicitud debido a un error de base de datos. Por favor, inténtelo de nuevo más tarde.'
            error_message += f'\n{str(e)}'
            return Response({'message': error_message, 'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            error_message = 'Se ha producido un error inesperado en el servidor. Por favor, inténtelo de nuevo más tarde.'
            return Response({'message': error_message, 'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request, *args, **kwargs):
        try:
            serializer = self.serializer(data=request.data)
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


class DetailAbstractView(APIView):
    model = None
    serializer = None

    def get_object(self, pk):
        return self.model.objects.get(pk=pk)

    def patch(self, request, pk, *args, **kwargs):
        try:
            instance = self.get_object(pk)
            serializer = self.serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response({'message': 'Se ha actualizado correctamente', 'data': serializer.data},
                            status=status.HTTP_200_OK)
        except self.model.DoesNotExist as e:
            error_message = f'No se ha encontrado un objeto con el id {pk}'
            return Response({'message': error_message}, status=status.HTTP_404_NOT_FOUND)
        except DatabaseError as e:
            error_message = 'No se puede procesar su solicitud debido a un error de base de datos. Por favor, inténtelo de nuevo más tarde.'
            error_message += f'\n{str(e)}'
            return Response({'message': error_message, 'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            error_message = 'Se ha producido un error inesperado en el servidor. Por favor, inténtelo de nuevo más tarde.'
            return Response({'message': error_message, 'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, pk, *args, **kwargs):
        try:
            instance = self.get_object(pk)
            instance.delete()
            return Response({'message': 'Se ha eliminado correctamente'}, status=status.HTTP_200_OK)
        except self.model.DoesNotExist as e:
            error_message = f'No se ha encontrado un objeto con el id {pk}'
            return Response({'message': error_message}, status=status.HTTP_404_NOT_FOUND)
        except ProtectedError as e:
            error_message = 'No se puede eliminar este objeto porque está relacionado con otros objetos.'
            return Response({'message': error_message}, status=status.HTTP_403_FORBIDDEN)
        except DatabaseError as e:
            error_message = 'No se puede procesar su solicitud debido a un error de base de datos. Por favor, inténtelo de nuevo más tarde.'
            error_message += f'\n{str(e)}'
            return Response({'message': error_message, 'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            error_message = 'Se ha producido un error inesperado en el servidor. Por favor, inténtelo de nuevo más tarde.'
            return Response({'message': error_message, 'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ListStaffView(ListAbstractView):
    model = Staff
    serializer = StaffSerializer

    def get_queryset(self):
        return self.model.objects.all()

    def get(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            full_name = request.query_params.get('full_name', None)
            active = request.query_params.get('status', None)
            if full_name:
                queryset = queryset.filter(full_name__icontains=full_name)
            if active == 'true':
                queryset = queryset.filter(status=True)
            else:
                queryset = queryset.filter(status=False)
            serializer = self.serializer(queryset, many=True)
            return Response({'data': serializer.data}, status=status.HTTP_200_OK)
        except DatabaseError as e:
            error_message = 'No se puede procesar su solicitud debido a un error de base de datos. Por favor, inténtelo de nuevo más tarde.'
            error_message += f'\n{str(e)}'
            return Response({'message': error_message, 'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            error_message = 'Se ha producido un error inesperado en el servidor. Por favor, inténtelo de nuevo más tarde.'
            return Response({'message': error_message, 'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DetailStaffView(DetailAbstractView):
    model = Staff
    serializer = StaffSerializer


class ListDepartmentView(ListAbstractView):
    model = Department
    serializer = DepartmentSerializer


class ListAbsenteeismView(ListAbstractView):
    model = Absenteeism
    serializer = AbsenteeismSerializer


class FindUserView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            uuid = request.data.get('code')
            if uuid:
                uuid = uuid.strip()
                try:
                    user = Staff.objects.get(uuid__icontains=uuid)
                    serializer = StaffSerializer(user, many=False)
                    return Response({'data': serializer.data}, status=status.HTTP_200_OK)
                except Staff.DoesNotExist:
                    return Response({'message': 'No existe el usuario'}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response({'message': 'No se ha encontrado el UUID'}, status=status.HTTP_404_NOT_FOUND)
        except DatabaseError as e:
            error_message = 'No se puede procesar su solicitud debido a un error de base de datos. Por favor, inténtelo de nuevo más tarde.'
            return Response({'message': error_message, 'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            print(e)
            error_message = 'Se ha producido un error inesperado en el servidor. Por favor, inténtelo de nuevo más tarde.'
            return Response({'message': error_message, 'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class StaffNotTrackingView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            date = request.data.get('date', None)
            staff = []
            users = Staff.objects.filter(status=False)

            if date:
                date = datetime.strptime(date, '%Y-%m-%d').date()
                for user in users:
                    if user.date_of_farewell and user.date_of_farewell < date:
                        continue
                    tracking_exists = Tracking.objects.filter(staff=user, date=date).exists()
                    # Si no hay registro en el tracking para la fecha actual, agregar el usuario a la lista
                    if not tracking_exists:
                        staff.append({'name': user.full_name, 'uuid': user.uuid})
            return Response({'data': staff}, status=status.HTTP_200_OK)
        except DatabaseError as e:
            error_message = 'No se puede procesar su solicitud debido a un error de base de datos. Por favor, inténtelo de nuevo más tarde.'
            return Response({'message': error_message, 'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            print(e)
            error_message = 'Se ha producido un error inesperado en el servidor. Por favor, inténtelo de nuevo más tarde.'
            return Response({'message': error_message, 'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
