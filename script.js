const app = (() => {
    const _form = document.querySelector('.container__form-outer__form');
    const _titleInput = document.querySelector('#name');
    const _dateInput = document.querySelector('#end');
    const _timeInput = document.querySelector('#time');
    const _eventsDOM = document.querySelector('.container__events');
    const _overlay = document.querySelector('.overlay');
    const _overlayTitle = document.querySelector('.overlay__body__title');

    const _titleInputError = document.querySelector('.container__form-outer__form__title-error');
    const _dateInputError = document.querySelector('.container__form-outer__form__date-error');

    let events = [];
    let _counter = 0;

    renderEventsLocalStorage();

    _overlay.addEventListener('click', (event) => {
        _overlay.classList.add('hidden');
    })

    _form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        let _endDate = _dateInput.value;
        let _time = _timeInput.value;
        let _title = _titleInput.value;

        if (!checkValidTitle(_title)) {
            renderTitleInputError();
            return;
        }

        if (!checkValidDateTime(_endDate, _time)) {
            renderDateInputError();
            return;
        }

        clearInputsError();
        renderEvent(_title, _endDate, _time);
        saveEvent(_title, _endDate, _time);
        saveEventsLocalStorage();
    })

    function checkValidDateTime(date, time) {
        let endTime = new Date(`${date} ${time}`).getTime();
        let currentTime = new Date().getTime();

        return currentTime < endTime;
    }

    function checkValidTitle(title) {
        return title.length > 0;
    }

    function renderTitleInputError() {
        _titleInputError.textContent = 'Event title can not be blank.';
        _titleInputError.classList.remove('hidden');
    }

    function renderDateInputError() {
        _dateInputError.textContent = 'Event end time can not be smaller than current time';
        _dateInputError.classList.remove('hidden');
    }

    function clearInputsError() {
        _titleInputError.classList.add('hidden');
        _dateInputError.classList.add('hidden');
    }

    function saveEvent(title, date, time) {
        events.push({
            id: _counter,
            title,
            date,
            time,
        });
        _counter++;
    }

    function saveEventsLocalStorage() {
        localStorage.setItem("events", JSON.stringify(events));
    }

    function renderEvent(title, date, time) {
        _eventsDOM.appendChild(
            createEventDOM(_counter, title, date, time)
        );
    }

    function renderEventsLocalStorage() {
        let localStorageEvents = localStorage.getItem('events');

        if ( localStorageEvents ) {
            events = [...JSON.parse(localStorageEvents)];
            events.forEach((event) => {
                _eventsDOM.appendChild(
                    createEventDOM(event.id, event.title, event.date, event.time)
                );
                _counter = event.id;
            })
            _counter++;
        }
    }

    function randomHexColor() {
        return Math.floor(Math.random() * parseInt("ffffff", 16));
    }

    function displayEventEnd(title, futureDate, futureTime) {
        _overlay.classList.remove('hidden');
        let time = `${new Date(`${futureDate}`).toDateString()} ${new Date(`${futureDate} ${futureTime}`).toLocaleTimeString()}`;
        _overlayTitle.textContent = `${title.toUpperCase()} is happening at ${time}`;
    }

    function calculateRemainTime(title, futureDate, futureTime, intervalID) {
        let futureEpoch = new Date(`${futureDate} ${futureTime}`).getTime();
        let currentEpoch = new Date().getTime();

        let remainEpoch = futureEpoch - currentEpoch;

        if ( remainEpoch <= 0 ) {
            displayEventEnd(title, futureDate, futureTime);
            clearInterval(intervalID);
            return `0 days : 0 hours : 0 minutes : 0 seconds`;
        }

        let days = Math.floor(remainEpoch / (1000 * 60 * 60 * 24));
        let hours = Math.floor((remainEpoch % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((remainEpoch % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((remainEpoch % (1000 * 60)) / 1000);

        return `${days} days : ${hours} hours : ${minutes} minutes : ${seconds} seconds`;
    }

    function createEventDOM(id, title, date, time) {
        let eventContainer = document.createElement('section');
        let titleDOM = document.createElement('h2');
        let dateDOM = document.createElement('time');
        let remainTimeDOM = document.createElement('time');
        let deleteEventButtonDOM = document.createElement('span');

        eventContainer.classList.add('container__events__event');
        titleDOM.classList.add('container__events__event__title');
        dateDOM.classList.add('container__events__event__date-time');
        remainTimeDOM.classList.add('container__events__event__remain-time');
        deleteEventButtonDOM.classList.add('container__events__event__delete');

        deleteEventButtonDOM.setAttribute('id', id);

        eventContainer.style.borderLeftColor = `#${randomHexColor()}`;

        titleDOM.textContent = title;
        dateDOM.textContent = `${new Date(`${date}`).toDateString()} ${new Date(`${date} ${time}`).toLocaleTimeString()}`;
        deleteEventButtonDOM.textContent = 'X';

        let currentEpoch = new Date().getTime();
        let futureEpoch = new Date(`${date} ${time}`).getTime();

        if (currentEpoch <= futureEpoch) {
            let intervalID = setInterval(() => {
                remainTimeDOM.textContent = calculateRemainTime(title, date, time, intervalID);
            }, 1000)
        } else {
            remainTimeDOM.textContent = `0 days : 0 hours : 0 minutes : 0 seconds`;
        }

        deleteEventButtonDOM.addEventListener('click', () => {
            deleteEventById(Number.parseInt(deleteEventButtonDOM.getAttribute('id'), 10));
            saveEventsLocalStorage();
            eventContainer.remove();
        })

        eventContainer.append(titleDOM, dateDOM, remainTimeDOM, deleteEventButtonDOM);

        return eventContainer;
    }

    function deleteEventById(id) {
        events = events.filter((event) => event.id != id);
    }
})();