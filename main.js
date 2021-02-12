$(function () {
    $.ajax({
        url: 'https://api.track.toggl.com/reports/api/v2/details',
        type: 'get',
        data: {
            workspace_id: '', /*id*/
            since: '2020-12-01',
            until: '2021-01-01',
            user_agent: 'api_test'
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa('' + ":" + 'api_token')); /* api token */
        },
        dataType: 'json',
    }).done(function(data) {
        const timeEntries = data.data;
        timeEntries.forEach(element => {
            const id = element.id;
            const description = element.description ? element.description  : 'no-description';
            const project = element.project ? element.project : 'no-project';
            const tags = element.tags;
            let tagsStr = "";
            tags.forEach(element => {
                tagsStr = tagsStr + element;
            });
            const start = new Date(element.start);
            const left = start.getHours() * 100 + Math.floor(start.getMinutes() * 100 / 60);
            const duration = element.dur;
            const width = Math.floor(duration * 100 / (1000 * 60 * 60));
            console.log(width);
            $('#time-entry-description-area').append('<div class="time-entry-description-container"><div class="description column"><span>' + description + '<span></div><div class="project column"><span>' + project + '</span></div><div class="tags column"><div class="tag"><span>' + tagsStr + '<span></div></div></div>');
            $('#time-entry-area').append('<div class="time-entry-container"><div class="time-entry" data-time-entry-id="' + id + '"></div></div>');
            $('div[data-time-entry-id="' + id + '"]').css('left', left).css('width', width);
        });
    }).fail(function() {
        console.log('fail');
    });
});