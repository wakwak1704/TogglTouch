$(function () {
    let p = getCurrentUserData();
    p.done((currentUserData) => {
        currentUserData.data.projects.forEach(project => {
            let rgb = getRGB(project.color);
            let optionTag = `<option data-id="${project.id}" data-color="${project.color}" style="color: ${rgb};">${project.name}</option>`;
            $("#create-time-entry-project").append(optionTag)
        });
    }).fail(() => {

    })

    function getDisplayDateFromDate(date) {
        return date.toString().replace(/\s[0-9]{4}.*/, '');
    }
    $('.time-entry').on({
        'mouseenter': function (obj) {

        },
        'mouseleave': function (obj) {

        }
    });

    $('.time-entry').on('click', function (obj) {

    });


    const today = Date();
    $('#target-date').text(getDisplayDateFromDate(today));
    $('#target-date').data('target-date', today.toString())


    $('#one-day-ago').on('click', function () {
        const targetDay = new Date($('#target-date').data('target-date'));
        targetDay.setDate(targetDay.getDate() - 1);
        $('#target-date').text(getDisplayDateFromDate(targetDay));
        $('#target-date').data('target-date', targetDay.toString())
        displayTimeEntries();
    });

    $('#one-day-later').on('click', function () {
        const targetDay = new Date($('#target-date').data('target-date'));
        targetDay.setDate(targetDay.getDate() + 1);
        $('#target-date').text(getDisplayDateFromDate(targetDay));
        $('#target-date').data('target-date', targetDay.toString())
        displayTimeEntries();
    });
    displayTimeEntries();
    function displayTimeEntries() {
        const workspace_id = $('#workspace_id').text();
        const api_token = $('#api_token').text();


        $('#time-entry-description-area').empty();
        $('#time-entry-area').empty();
        const targetDate = new Date($('#target-date').data('target-date'));
        const targetDateStr = targetDate.getFullYear() + '-' + (targetDate.getMonth() + 1) + '-' + targetDate.getDate();

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
            const totalGrand = data.total_grand
            $('#total-grand').empty();
            if (totalGrand) {
                let seconds = Math.floor((totalGrand / 1000) % 60);
                let minutes = Math.floor((totalGrand / 1000 / 60) % 60);
                let hours = Math.floor((totalGrand / 1000 / 3600) % 24)

                $('#total-grand').append(`<span>Total </span><span>${hours}:${minutes}</span>`);
            }


            const timeEntries = data.data.sort((timeEntryA, timeEntryB) => {
                return new Date(timeEntryA.start).getTime() - new Date(timeEntryB.start).getTime();
            });
            timeEntries.forEach(element => {

                const id = element.id;
                const description = element.description ? element.description : 'no-description';
                const project = element.project ? element.project : 'no-project';
                const hex = element.project ? element.project_hex_color : '#000000';
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
                if (element.pid) {
                    $.ajax({
                        url: 'https://api.track.toggl.com/api/v8/projects/' + element.pid,
                        type: 'get',
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader("Authorization", "Basic " + btoa(api_token + ":" + 'api_token'));
                        },
                        dataType: 'json',
                    })
                        .done(function (data) {

                        }).fail(function () {

                        });
                }
                $('#time-entry-description-area').append(`<div class="time-entry-description-container"><div class="description column"><span>${description}<span></div><div class="project column" style="color: ${hex};"><span>${project}</span></div><div class="tags column"><div class="tag"><span>${tagsStr}<span></div></div></div>`);
                $('#time-entry-area').append(`<div class="time-entry-container"><div class="time-entry" data-time-entry-id="${id}" style="background-color: ${hex};"></div></div>`);
                $('div[data-time-entry-id="' + id + '"]').css('left', left).css('width', width);
            });
        }).fail(function () {

        });
    }

    function getCurrentUserData() {
        let d = new $.Deferred;
        const api_token = $('#api_token').text();
        $.ajax({
            url: "https://api.track.toggl.com/api/v8/me",
            type: "get",
            data: {
                with_related_data: "true"
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Basic " + btoa(api_token + ":" + 'api_token'));
            },
            dataType: 'json',
        }).done(data => {
            d.resolve(data);
        }).fail(() => {

            d.reject();
        });
        return d.promise()
    }

    function getRGB(color) {
        let rgb = "rgb(0, 0, 0)";
        switch (color) {
            case "1":
                rgb = "rgb(11, 131, 217)";
                break;
            case "2":
                rgb = "rgb(158, 91, 217)";
                break;
            case "3":
                rgb = "rgb(217, 65, 130)";
                break;
            case "4":
                rgb = "rgb(227, 106, 0)";
                break;
            case "5":
                rgb = "rgb(191, 112, 0)";
                break;
            case "6":
                rgb = "rgb(45, 166, 8)";
                break;
            case "7":
                rgb = "rgb(6, 168, 147)";
                break;
            case "8":
                rgb = "rgb(201, 128, 107)";
                break;
            case "9":
                rgb = "rgb(70, 91, 179)";
                break;
            case "10":
                rgb = "rgb(153, 0, 153)";
                break;
            case "11":
                rgb = "rgb(199, 175, 20)";
                break;
            case "12":
                rgb = "rgb(86, 102, 20)";
                break;
            case "13":
                rgb = "rgb(217, 43, 43)";
                break;
            case "14":
                rgb = "rgb(82, 82, 102)";
                break;
            case "15":
                rgb = "rgb(153, 17, 2)";
                break;
        }
        return rgb;
    }
});