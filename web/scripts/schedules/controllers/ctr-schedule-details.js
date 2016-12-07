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

     //   var date = new Date();
    // var d = date.getDate();
    // var m = date.getMonth();
    // var y = date.getFullYear();
    
    //   $scope.calendarEvents = [
    //    [
    //   {title: 'All Day Event',start: new Date(y, m, 1)},
    //   {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
    //   {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
    //   {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
    //   {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false},
    //   {title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
    // ]
    //   ];
      var RECURRENCE = {
        DAILY: "Daily",
        WEEKLY: "Weekly",
        MONTHLY: "Monthly",
        YEARLY: "Yearly"
      };

      function getDates(startDate, stopDate) {
        var dateArray = [];
        var currentDate = moment(startDate);
        while (currentDate <= stopDate) {
            dateArray.push( moment(currentDate).format('YYYY-MM-DD') )
            currentDate = moment(currentDate).add(1, 'days');
        }
        return dateArray;
    }

      var calendarStart, calendarEnd;
      $scope.populateEvents = function() {
        if (!calendarStart || !calendarEnd) return;
        var events = [];
        angular.forEach($scope.schedule.content,function(item){

          if (item.timeDefined) { 
            if (item.recurrenceType == RECURRENCE.DAILY) {
              var calendarRange = getDates(calendarStart,calendarEnd);
              angular.forEach(calendarRange,function(date){
                if ((!item.startDate || moment(date) >= moment(item.startDate)) && (!item.endDate || moment(date) <= moment(item.endDate))) {
                  var event = {title: item.name, item:item};
                  event.start = item.startTime?moment(date).add(moment.duration(moment(item.startTime).format('HH:mm'))):moment(date);
                  event.end = item.endTime?moment(date).add(moment.duration(moment(item.endTime).format('HH:mm'))):moment(date).add(1,'days');
                  
                  if (item.startTime) {
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

            } else if (item.recurrenceType == RECURRENCE.MONTHLY) {

            } else if (item.recurrenceType == RECURRENCE.YEARLY) {

            }

          } else { // 24/7
            var calendarRange = getDates(calendarStart,calendarEnd);
            angular.forEach(calendarRange,function(date){
              var event = {
                title: item.name, 
                start: date,
                end: moment(date).add(24, 'hours'),
                item:item
              }
              events.push(event)
            });
          }
        });
        $scope.calendarEvents[0] = events;
      }


      $scope.calendarOptions = {
        allDaySlot: false,
        defaultView: 'agendaWeek',
        height: 650,
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
            console.log("View Changed: ", view.start, view.end);
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
