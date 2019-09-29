if (!('getEventListeners' in window)) {
	getEventListeners = function(el) {
		let _ev,
			_evs = Object.assign({}, (el._events || {}));
		for (let ev in el) {
			if (/^on/.test(ev) && (typeof(el[ev]) === 'function') && (_ev = ev.slice(2))) {
				if (!_evs[_ev])
					_evs[_ev] = [];
				_evs[_ev].push({
					listener: el[ev],
					useCapture: false,
					passive: false,
					once: false,
					type: _ev
				});
			}
		}
		return _evs;
	}
	EventTarget.prototype._addEventListener = EventTarget.prototype.addEventListener;
	EventTarget.prototype._removeEventListener = EventTarget.prototype.removeEventListener;
	EventTarget.prototype.addEventListener = function(a, b, c) {
		if (c == undefined)
			c = false;
		if (c && c.once) {
			let _b = b;
			b = function() {
				this.removeEventListener(a, b, false, true);
				_b.apply(this, arguments);
			};
		}
		this._addEventListener(a, b, c);
		if (!this._events) {
			this._events = {};
			Object.defineProperty(this, '_events', { enumerable: false });
		}
		if (!this._events[a])
			this._events[a] = [];
		this._events[a].push({
			listener: b,
			useCapture: (((c === true) || (c.capture)) || false),
			passive: ((c && c.passive) || false),
			once: ((c && c.once) || false),
			type: a
		});
	}
	EventTarget.prototype.removeEventListener = function(a, b, c, s) {
		if (c == undefined)
			c = false;
		if (!s)
			this._removeEventListener(a, b, c);
		if (this._events && this._events[a]) {
			for (var i=0; i<this._events[a].length; ++i) {
				if ((this._events[a][i].listener == b) && (this._events[a][i].useCapture == c)) {
					this._events[a].splice(i, 1);
					break;
				}
			}
			if (this._events[a].length == 0)
				delete this._events[a];
		}
	}
}
Element.prototype.on = function(event, callback, options) {
	this.addEventListener(event, callback, options);
	return this;
}
Element.prototype.off = function (event, callback, options) {
	this.removeEventListener(event, callback, options);
	return this;
}
Element.prototype.emit = function (event, args=null) {
	this.dispatchEvent(new CustomEvent(event, {detail: args}));
	return this;
}
Object.defineProperties(Element.prototype, {
	on: { enumerable: false },
	off: { enumerable: false },
	emit: { enumerable: false }
});
