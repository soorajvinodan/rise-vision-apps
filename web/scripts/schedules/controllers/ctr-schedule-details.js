'use strict';

angular.module('risevision.schedules.controllers')
  .controller('scheduleDetails', ['$scope', '$q', '$state',
    'scheduleFactory', '$loading', '$log', '$modal', '$templateCache',
    function ($scope, $q, $state, scheduleFactory, $loading, $log, $modal,
      $templateCache) {
      $scope.factory = scheduleFactory;
      $scope.schedule = scheduleFactory.schedule;

      $scope.$watch('factory.loadingSchedule', function (loading) {
        if (loading) {
          $loading.start('schedule-loader');
        } else {
          $loading.stop('schedule-loader');
        }
      });

      $scope.confirmDelete = function () {
        $scope.modalInstance = $modal.open({
          template: $templateCache.get(
            'confirm-instance/confirm-modal.html'),
          controller: 'confirmInstance',
          windowClass: 'modal-custom',
          resolve: {
            confirmationTitle: function () {
              return 'schedules-app.details.deleteTitle';
            },
            confirmationMessage: function () {
              return 'schedules-app.details.deleteWarning';
            },
            confirmationButton: function () {
              return 'common.delete-forever';
            },
            cancelButton: null
          }
        });

        $scope.modalInstance.result.then(scheduleFactory.deleteSchedule);
      };

      $scope.addSchedule = function () {
        if (!$scope.scheduleDetails.$dirty) {
          $state.go('apps.schedules.add');
        } else {
          $scope.modalInstance = $modal.open({
            template: $templateCache.get(
              'confirm-instance/confirm-modal.html'),
            controller: 'confirmInstance',
            windowClass: 'modal-custom',
            resolve: {
              confirmationTitle: function () {
                return 'schedules-app.details.unsavedTitle';
              },
              confirmationMessage: function () {
                return 'schedules-app.details.unsavedWarning';
              },
              confirmationButton: function () {
                return 'common.save';
              },
              cancelButton: function () {
                return 'common.discard';
              }
            }
          });

          $scope.modalInstance.result.then(function () {
            // do what you need if user presses ok
            $scope.save()
              .then(function () {
                $state.go('apps.schedules.add');
              });
          }, function (value) {
            // do what you need to do if user cancels
            if (value) {
              $state.go('apps.schedules.add');
            }
          });
        }
      };

      $scope.save = function () {
        if (!$scope.scheduleDetails.$valid) {
          $log.info('form not valid: ', $scope.scheduleDetails.$error);

          return $q.reject();
        } else {
          return scheduleFactory.updateSchedule();
        }
      };

      
      $scope.calendarEvents = [[]]

     $scope.$watch('schedule.content',function(playlistItems){
        console.log('content changed', $scope.schedule.content)
        $scope.populateEvents();
      },true);

      var RECURRENCE = {
        DAILY: "Daily",
        WEEKLY: "Weekly",
        MONTHLY: "Monthly",
        YEARLY: "Yearly"
      };
      var DAY_OF_WEEK = {
        SUNDAY: 'Sun',
        MONDAY: 'Mon',
        TUESDAY: 'Tue',
        WEDNESDAY: 'Wed',
        THURSDAY: 'Thu',
        FRIDAY: 'Fri',
        SATURDAY: 'Sat',
      };

      var getDates = function (startDate, stopDate) {
        var dateArray = [];
        var currentDate = moment(startDate);
        while (currentDate <= stopDate) {
            dateArray.push( moment(currentDate).format('YYYY-MM-DD') )
            currentDate = moment(currentDate).add(1, 'days');
        }
        return dateArray;
      }

      var _diffDays = (fromDate, toDate) => {
        if (!fromDate || !toDate) {
          return -1;
        }
        var msecInOneDay = 1000 * 60 * 60 * 24;
        return parseInt((toDate.getTime() - fromDate.getTime()) / msecInOneDay);
      }

      var _diffMonths = (fromDate, toDate) => {
        return parseInt(((toDate.getYear() - fromDate.getYear()) * 12) + toDate.getMonth() - fromDate.getMonth());
      }

      var _diffWeeks = (fromDate, toDate) => {
        var days = _diffDays(fromDate, toDate);
        var weeks = (days + fromDate.getDay()) / 7;

        return parseInt(weeks);
      }

      var _isRecurrenceDay = function (weekday, recurrenceDaysOfWeek) {
        var dayOfWeeklbl = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'][weekday];
        var currDayCode = DAY_OF_WEEK[dayOfWeeklbl];

        if(recurrenceDaysOfWeek && recurrenceDaysOfWeek.indexOf(currDayCode) >= 0) {
          return true;
        } else {
          return false;
        }
      }

      var calendarStart, calendarEnd;
      $scope.populateEvents = function() {
        if (!calendarStart || !calendarEnd) return;
        var events = [];
        angular.forEach($scope.schedule.content,function(item){

          if (item.recurrenceType == RECURRENCE.DAILY) {
            var calendarRange = getDates(calendarStart,calendarEnd);
            angular.forEach(calendarRange,function(date){
              if ((!item.startDate || moment(date) >= moment(item.startDate)) && (!item.endDate || moment(date) <= moment(item.endDate))) {
                var event = {title: item.name, item:item};

                if (item.timeDefined) {
                  event.start = item.startTime?moment(date).add(moment.duration(moment(item.startTime).format('HH:mm'))):moment(date);
                  event.end = item.endTime?moment(date).add(moment.duration(moment(item.endTime).format('HH:mm'))):moment(date).add(1,'days');                
                } else {
                  event.start = date;
                  event.end = moment(date).add(24, 'hours');
                }
                
                if (item.startDate) {
                  var days = moment(item.startDate).diff(moment(date),'days')
                  if (parseInt(days % item.recurrenceFrequency) == 0) {
                    events.push(event);  
                  }
                } else {
                  events.push(event)  
                }                  
              }
            });
          } else if (item.recurrenceType == RECURRENCE.WEEKLY) {
            var calendarRange = getDates(calendarStart,calendarEnd);
            angular.forEach(calendarRange,function(date){
              if ((!item.startDate || moment(date) >= moment(item.startDate)) && (!item.endDate || moment(date) <= moment(item.endDate))) {
                var event = {title: item.name, item:item};

                if (item.timeDefined) {
                  event.start = item.startTime?moment(date).add(moment.duration(moment(item.startTime).format('HH:mm'))):moment(date);
                  event.end = item.endTime?moment(date).add(moment.duration(moment(item.endTime).format('HH:mm'))):moment(date).add(1,'days');                
                } else {
                  event.start = date;
                  event.end = moment(date).add(24, 'hours');
                }
                
                if (item.startDate) {
                  var weeks = _diffWeeks(moment(item.startDate).toDate(), moment(date).toDate());
                  if (parseInt(weeks % item.recurrenceFrequency) != 0) {
                    return;
                  }
                  var weekday = moment(date).toDate().getDay();
                  if (!_isRecurrenceDay(weekday, item.recurrenceDaysOfWeek)) {
                    return;
                  }
                  events.push(event);  
                }                
              }
            });
          } else if (item.recurrenceType == RECURRENCE.MONTHLY) {

          } else if (item.recurrenceType == RECURRENCE.YEARLY) {

          }
        });
        $scope.calendarEvents[0] = events;
        console.log($scope.schedule.content,$scope.calendarEvents);
      }


      $scope.calendarOptions = {
        allDaySlot: false,
        defaultView: 'agendaWeek',
        height: 550,
        editable: false,
        eventColor: '#4ab767',
        scrollTime: '00:00',
        header:{
          left: 'month agendaWeek agendaDay',
          center: 'title',
          right: 'today prev,next'
        },
        eventClick: function(e) {
          console.log('click',e)
          $modal.open({
            templateUrl: 'partials/schedules/playlist-item.html',
            controller: 'playlistItemModal',
            size: 'md',
            resolve: {
              playlistItem: function () {
                return e.item;
              }
            }
          });
          
        },
        viewRender: function(view, element) {
            calendarStart = view.start;
            calendarEnd = view.end;
            $scope.populateEvents();
        },
        eventRender: function(event, element) {
          element.css('cursor', 'pointer');
          element.attr('title', event.title);
        }
      };
    }
  ]);
