const controlButtons = document.querySelectorAll('button[data-role="control"]');
const trackingCards = document.querySelectorAll('.tracking-card');

const DEFAULT_TIME_SPAN = 'daily';
const TIME_SPANS_MAP = {
	daily: 'day',
	weekly: 'week',
	monthly: 'month',
};

const handleControlButton = (e) => {
	const button = e.target;
	removeActiveStates();
	button.classList.add('active');
	handleTimeSpanSwitch(button.dataset.timeframe);
};

/* removes active states from control buttons */
const removeActiveStates = () => {
	controlButtons.forEach((button) => button.classList.remove('active'));
};

/* loads data and inserts it */
const handleTimeSpanSwitch = async (timespan = DEFAULT_TIME_SPAN) => {
	const data = await loadData();
	if (!data || data.length === 0) {
		insertDummyData();
		return;
	}
	const processedData = processData(data, timespan);
	insertTrackingData(processedData, timespan);
};

/* load data from .json file */
const loadData = async () => {
	const response = await fetch('./data.json');

	if (!response.ok) return [];
	const data = await response.json();
	return data;
};

/* inserts dummy data and deactivates buttons when data from file won't load */
const insertDummyData = () => {
	removeActiveStates();
	trackingCards.forEach((card) => {
		const currentTime = card.querySelector('[data-time="current"]');
		const previousTime = card.querySelector('[data-time="previous"]');
		const timeSpan = card.querySelector('[data-time-span]');
		currentTime.innerText = 0;
		previousTime.innerText = 0;
		timeSpan.innerText = 'Week';
	});
};

/* maps data into object with titles as keys and timeframes object as values */
const processData = (data, timespan = DEFAULT_TIME_SPAN) => {
	return data.reduce((result, trackData) => {
		const category = trackData.title.toLowerCase();
		result[category] = { ...trackData.timeframes[timespan] };
		return result;
	}, {});
};

/* inserts processed data */
const insertTrackingData = (data, timespan = DEFAULT_TIME_SPAN) => {
	for (let category in data) {
		const card = document.querySelector(`.tracking-card[data-category="${category}"]`);
		const currentTime = card.querySelector('[data-time="current"]');
		const previousTime = card.querySelector('[data-time="previous"]');
		const timeSpan = card.querySelector('[data-time-span]');
		const { current, previous } = data[category];
		currentTime.innerText = current;
		previousTime.innerText = previous;
		timeSpan.innerText = TIME_SPANS_MAP[timespan];
	}
};

controlButtons.forEach((button) => button.addEventListener('click', handleControlButton));
handleTimeSpanSwitch();
