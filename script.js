const app = (() => {
    const _form = document.querySelector('.container__form-outer__form');
    const _titleInput = document.querySelector('#name');
    const _dateInput = document.querySelector('#end');
    const _timeInput = document.querySelector('#time');
    const _eventsDOM = document.querySelector('.container__events');

    const _titleInputError = document.querySelector('.container__form-outer__form__title-error');
    const _dateInputError = document.querySelector('.container__form-outer__form__date-error');
    

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

    function renderEvent(title, date, time) {
        _eventsDOM.appendChild(
            createEventDOM(title, date, time)
        );
    }

    function randomHexColor() {
        return Math.floor(Math.random() * parseInt("ffffff", 16));
    }

    function createEventDOM(title, date, time) {
        let eventContainer = document.createElement('section');
        let titleDOM = document.createElement('h2');
        let dateDOM = document.createElement('time');

        eventContainer.classList.add('container__events__event');
        titleDOM.classList.add('container__events__event__title');
        dateDOM.classList.add('container__events__event__date-time');

        eventContainer.style.borderLeftColor = `#${randomHexColor()}`;

        titleDOM.textContent = title;
        dateDOM.textContent = `${new Date(`${date}`).toDateString()} ${new Date(`${date} ${time}`).toLocaleTimeString()}`;

        eventContainer.append(titleDOM, dateDOM);

        return eventContainer;
    }
})();