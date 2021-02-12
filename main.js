$(function () {
    const today = Date();
    $('#target-date').text(today.toString());

    $('#one-day-ago').on('click', function () {
        const targetDay = new Date($('#target-date').text());
        targetDay.setDate(targetDay.getDate() - 1);
        $('#target-date').text(targetDay.toString());
        displayTimeEntries();
    });

    $('#one-day-later').on('click', function () {
        const targetDay = new Date($('#target-date').text());
        targetDay.setDate(targetDay.getDate() + 1);
        $('#target-date').text(targetDay.toString());
        displayTimeEntries();
    });
    displayTimeEntries();
    function displayTimeEntries() {
        const workspace_id = $('#workspace_id').text();
        const api_token = $('#api_token').text();


        $('#time-entry-description-area').empty();
        $('#time-entry-area').empty();
        const targetDate = new Date($('#target-date').text());
        const targetDateStr = targetDate.getFullYear() + '-' + (targetDate.getMonth() + 1) + '-' + targetDate.getDate();
        console.log(targetDateStr);
        $.ajax({
            url: 'https://api.track.toggl.com/reports/api/v2/details',
            type: 'get',
            data: {
                workspace_id: workspace_id,
                since: targetDateStr,
                until: targetDateStr,
                user_agent: 'api_test'
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Basic " + btoa(api_token + ":" + 'api_token'));
            },
            dataType: 'json',
        }).done(function (data) {
            const timeEntries = data.data.sort((timeEntryA, timeEntryB) => {
                return new Date(timeEntryA.start).getTime() - new Date(timeEntryB.start).getTime();
            });
            timeEntries.forEach(element => {
                const id = element.id;
                const description = element.description ? element.description : 'no-description';
                const project = element.project ? element.project : 'no-project';
                const tags = element.tags;
                let tagsStr = "";
                tags.forEach(element => {
                    tagsStr = tagsStr + element;
                });
                const start = new Date(element.start);
                const offset = 20;
                const left = offset + start.getHours() * 100 + Math.floor(start.getMinutes() * 100 / 60);
                const duration = element.dur;
                const width = Math.floor(duration * 100 / (1000 * 60 * 60));
                // if(element.pid) {
                //     $.ajax({
                //         url: 'https://api.track.toggl.com/api/v8/projects/' + element.pid,
                //         type: 'get',
                //         beforeSend: function (xhr) {
                //             xhr.setRequestHeader("Authorization", "Basic " + btoa(api_token + ":" + 'api_token'));
                //         },
                //         dataType: 'json',
                //     });
                //     // .done(function(data) {
                //     //     console.log('success');
                //     // }).failse(function() {
                //     //     console.log('fail');
                //     // });
                // }
                $('#time-entry-description-area').append('<div class="time-entry-description-container"><div class="description column"><span>' + description + '<span></div><div class="project column"><span>' + project + '</span></div><div class="tags column"><div class="tag"><span>' + tagsStr + '<span></div></div></div>');
                $('#time-entry-area').append('<div class="time-entry-container"><div class="time-entry" data-time-entry-id="' + id + '"></div></div>');
                $('div[data-time-entry-id="' + id + '"]').css('left', left).css('width', width);
            });
        }).fail(function () {
            console.log('fail');
        });
    }
});