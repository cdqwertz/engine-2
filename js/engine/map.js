/*

The MIT License (MIT)

Copyright (c) 2017 cdqwertz <cdqwertz@gmail.com>

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

var AUTO_TILING_NONE = 0;
var AUTO_TILING_FLOOR = 1;
var AUTO_TILING_4 = 2;
var AUTO_TILING_8 = 0;
var AUTO_TILING_ROTATE = 4;

function tileset (e) {
	this.engine = e;
	this.sprite = null;
	this.tiles = [];

	this.init = function (sprite) {
		this.sprite = sprite;
	};

	this.push = function (t) {
		this.tiles.push(t);
		return this.tiles.length-1;
	};

	this.get_auto_tiling_mode = function (id) {
		if (this.tiles[id].auto_tiling) {
			return this.tiles[id].auto_tiling;
		} else {
			return 0;
		}
	}

	this.render = function (id, variation, pos) {
		if (this.tiles[id].rects) {
			this.engine.renderer.push({
				type : SPRITE_ANIMATED,
				frame : this.tiles[id].rects[variation],
				mode : CORNER,
				pos : pos,
				sprite : this.sprite
			});
		} else {
			this.engine.renderer.push({
				type : SPRITE_ANIMATED,
				frame : this.tiles[id].rect,
				mode : CORNER,
				pos : pos,
				sprite : this.sprite
			});
		}
	};
}

function map (e, pos, size, tile_size, my_tileset) {
	this.engine = e;
	this.size = size;

	this.pos = pos;

	this.tileset = my_tileset;
	this.tile_size = tile_size;
	this.data = [];

	this.init = function () {
		for (var i = 0; i < this.size.x; i++) {
			var a = [];

			for (var j = 0; j < this.size.y; j++) {
				a.push([-1, 0]);
			}

			this.data.push(a);
		}
	};

	this.randomize = function (tiles, a) {
		for (var i = 0; i < this.data.length; i++) {
			for (var j = 0; j < this.data[i].length; j++) {
				if (Math.random() > a) {
					this.data[i][j] = [tiles[Math.floor(Math.random()*tiles.length)], 0];
				}
			}
		}
	};

	this.fill = function (tile) {
		for (var i = 0; i < this.data.length; i++) {
			for (var j = 0; j < this.data[i].length; j++) {
				this.data[i][j] = [tile, 0];
			}
		}
	}

	this.is_on_map = function (p) {
		return (p.x >= 0 && p.y >= 0 && p.x < this.data.length && p.y < this.data[0].length);
	};

	this.update_auto_tiling = function () {
		for (var i = 0; i < this.data.length; i++) {
			for (var j = 0; j < this.data[i].length; j++) {
				var tile = this.data[i][j][0];

				if (tile != -1) {
					var mode = this.tileset.get_auto_tiling_mode (tile);

					if (mode == AUTO_TILING_FLOOR) {
						if (this.get_tile(new vec2(i, j-1)) != tile) {
							this.data[i][j][1] = 1;
						} else {
							this.data[i][j][1] = 0;
						}
					} else if (mode == AUTO_TILING_ROTATE) {
						var tile_up = this.get_tile(new vec2(i, j-1));
						var tile_down = this.get_tile(new vec2(i, j+1));
						var tile_left = this.get_tile(new vec2(i+1, j));
						var tile_right = this.get_tile(new vec2(i-1, j));

						if (tile_up == -1) {
							this.data[i][j][1] = 1;
						} else if (tile_down == -1) {
							this.data[i][j][1] = 0;
						} else if (tile_left == -1) {
							this.data[i][j][1] = 3;
						} else if (tile_right == -1) {
							this.data[i][j][1] = 2;
						} else {
							this.data[i][j][1] = 1;
						}
					} else if (mode == AUTO_TILING_4) {

					} else if (mode == AUTO_TILING_8) {

					} else {
						this.data[i][j][1] = 0;
					}
				}
			}
		}
	};

	this.render = function () {
		for (var i = 0; i < this.data.length; i++) {
			for (var j = 0; j < this.data[i].length; j++) {
				if (this.tile_size.x * i >= -(this.engine.renderer.viewport.x) - this.tile_size.x &&
					this.tile_size.x * (i+1) <= -(this.engine.renderer.viewport.x) + this.engine.game.size.x + this.tile_size.x) {
					var tile = this.data[i][j];

					if (tile[0] != -1) {
						this.tileset.render(
							tile[0], tile[1],
							new vec2(i*this.tile_size.x+this.pos.x, j*this.tile_size.y+this.pos.y)
						);
					}
				}
			}
		}
	};

	this.get_colliders = function () {
		var coll = [];

		for (var i = 0; i < this.data.length; i++) {
			for (var j = 0; j < this.data[i].length; j++) {
				var tile = this.data[i][j];

				if (tile[0] != -1) {
					var def = this.tileset.tiles[tile[0]];

					if (def.collider) {
						var my_rect = new rect(i*this.tile_size.x + def.collider.x+this.pos.x, j*this.tile_size.x+def.collider.y+this.pos.y,
							i*this.tile_size.x + def.collider.x + def.collider.w+this.pos.x, j*this.tile_size.x+def.collider.y + def.collider.h+this.pos.y);

						my_rect.meta.tile = tile[0];
						my_rect.meta.variation = tile[1];
						my_rect.meta.tile_pos = new vec2(i, j);
						coll.push(my_rect);
					}
				}
			}
		}

		return coll;
	};

	this.get_tile = function (pos) {
		if (this.is_on_map(pos)){
			return this.data[pos.x][pos.y][0];
		} else {
			return -2;
		}
	};

	this.set_tile = function (pos, my_tile) {
		if (this.is_on_map(pos)){
			this.data[pos.x][pos.y] = [my_tile, 0];
		} else {
			return -2;
		}
	};
}
