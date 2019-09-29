# js-events

Add and delete events
```javascript
var test = e => console.log(e);
document.body.addEventListener('scroll', test);
document.body.addEventListener('click', test, { once: true });
document.body.removeEventListener('scroll', test);
document.body
	.on('scroll', test)
	.on('click', test, { once: true })
	.off('scroll', test);
```

List events
```javascript
console.log(
	getEventListeners(document.body)
);
console.table(
	[document, window].concat([...document.querySelectorAll('*')]).map(el => {
		let evs = getEventListeners(el);
		// evs = (evs.click ? { click: evs.click } : []);
		return {
			el: el,
			types: Object.keys(evs).join(', '),
			listeners: evs
		};
	}).filter(item => item.types)
);
```
