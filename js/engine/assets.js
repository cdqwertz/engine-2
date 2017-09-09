/*

The MIT License (MIT)

Copyright (c) 2017 cd2 (cdqwertz) <cdqwertz@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this
software and associated documentation files (the "Software"), to deal in the Software
without restriction, including without limitation the rights to use, copy, modify, merge,
publish, distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or
substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.

*/

function assets () {
	this.images = {};
	this.sounds = {};

	this.load = function (src) {
		if (!this.images[src]) {
			this.images[src] = new Image ();
			this.images[src].src = src;
		}

		return this.images[src];
	};

	this.preload = function (src) {
		this.images[src] = new Image ();
		this.images[src].src = src;
	};

	this.load_sound = function (src) {
		if (!this.sounds[src]) {
			this.preload_sound(src);
		}

		return this.sounds[src];
	};

	this.preload_sound = function (src) {
		this.sounds[src] = new sound (src);
	};
}