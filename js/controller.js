if (!window.console) {
    window.console = {
        log: function() {}
    };
}

(function() {
    var camera = window.camera;
    spaceman.stop();
    /*
    window.onkeypress = function(e) {
        if (e.keyCode === 37 ||
            e.keyCode === 97) {
            console.log('Going Left');
            goLeft();
        } else if (e.keyCode === 38 ||
            e.keyCode === 119) {
            goUp();
        } else if (e.keyCode === 39 ||
            e.keyCode === 100) {
            goRight();

        } else if (e.keyCode === 40 ||
            e.keyCode === 115) {
            goDown();
        } else {
            console.log('Unknown key code', e.keyCode);
        }
    };
*/
    document.onkeydown = function(e) {
        if (e.keyCode === 37 ||
            e.keyCode === 97) {
            console.log('Going Left');
            e.preventDefault();
            goLeft();
        } else if (e.keyCode === 38 ||
            e.keyCode === 119) {
            e.preventDefault();
            goUp();
        } else if (e.keyCode === 39 ||
            e.keyCode === 100) {
            e.preventDefault();
            goRight();

        } else if (e.keyCode === 40 ||
            e.keyCode === 115) {
            e.preventDefault();
            goDown();
        } else {
            console.log('Unknown key code', e.keyCode);
            return true;
        }
        return false;
    };

    //document.getElementById('viewport').mozRequestFullScreen();

    /*
    var viewport = document.getElementById('viewport');
    viewport.addEventListener('touchstart', function(e) {
        log(typeof e.preventDefault);
        e.preventDefault();
        log('touchstart', e);
    }, false);
    viewport.addEventListener('touchmove', function(e) {
        log('touchstart', e);
    }, false);
    viewport.addEventListener('touchend', function(e) {
        log('touchend', e);
    }, false);
    viewport.addEventListener('touchcancel', function(e) {
        log('touctouchcancelhstart', e);
    }, false);
*/

    //alert(document.getElementById('viewport'));

    var hammer = Hammer(document.getElementById('viewport'));

    hammer.on('swiperight', function(e) {
        e.preventDefault();
        e.gesture.preventDefault();
        clearTimeout(touchTimeout);
        goRight();
    });
    hammer.on('swipeup', function(e) {
        e.preventDefault();
        e.gesture.preventDefault();
        clearTimeout(touchTimeout);
        goUp();
    });
    hammer.on('swipeleft', function(e) {
        e.preventDefault();
        e.gesture.preventDefault();
        clearTimeout(touchTimeout);
        goLeft();
    });
    hammer.on('swipedown', function(e) {
        e.preventDefault();
        e.gesture.preventDefault();
        clearTimeout(touchTimeout);
        goDown();
    });
    var touchTimeout;
    hammer.on('touch', function(e) {
        touchTimeout = setTimeout(function(){
        goToScreenPoint(e.gesture.touches[0].pageX, e.gesture.touches[0].pageY);
    }, 300);

    });

    /*
    ['drag, dragstart, dragend, dragup, dragdown, dragleft, dragright'].forEach(function(etype) {
        hammer.on(etype, function(e) {
            e.preventDefault();
            e.gesture.preventDefault();
        });
    });
    */
    function goLeft() {
        if (map.moveLeftAllowed()) {
            map.moveLeft();
            spaceman.walkLeft();
            setTimeout(function() {
                spaceman.stop();
            }, 300);
            camera.stepLeft();
        } else if (map.hasItemOnLeft()) {
            console.log('Checked for inventory on the left', map.currentCoordinates());
            var coords = map.currentCoordinates();
            coords[0] = coords[0] - 1;

            console.log(window.inventory);

            inventory.checkForItem(coords, function(item) {
                console.log('Checked for items... got', item);
                if (null !== item) {
                    ui.showMessage(item);
                }
            });
        }

    }

    function goUp() {
        //console.log('Go up triggered');
        if (map.moveUpAllowed()) {
            map.moveUp();

            camera.stepUp();
        } else if (map.hasItemUp()) {

            var coords = map.currentCoordinates();
            coords[1] = coords[1] - 1;
            inventory.checkForItem(coords, function(item) {
                if (null !== item) {
                    ui.showMessage(item);
                }
            });

        }
    }

    function goRight() {
        if (map.moveRightAllowed()) {
            map.moveRight();
            spaceman.walkRight();
            setTimeout(function() {
                spaceman.stop();
            }, 300);
            camera.stepRight();
        } else if (map.hasItemOnRight()) {

            var coords = map.currentCoordinates();
            coords[0] = coords[0] + 1;
            inventory.checkForItem(coords, function(item) {
                if (null !== item) {
                    ui.showMessage(item);
                }
            });

        }
    }

    function goDown() {

        if (map.moveDownAllowed()) {
            map.moveDown();
            camera.stepDown();
        } else if (map.hasItemDown()) {

            var coords = map.currentCoordinates();
            coords[1] = coords[1] + 1;
            inventory.checkForItem(coords, function(item) {
                if (null !== item) {
                    ui.showMessage(item);
                }
            });

        }
    }

    function goByCoordinates(from, to) {

        if (from[0] > to[0]) {
            console.log('going left');
            goLeft();
        } else if (from[1] > to[1]) {
            console.log('going up');
            goUp();
        } else if (from[0] < to[0]) {
            console.log('going right');
            goRight();
        } else if (from[1] < to[1]) {
            console.log('going down');
            goDown();
        }
    }

    var queuedMoves = [];
    setInterval(function() {
        var move = queuedMoves.shift();
        if ( !! move) {
            goByCoordinates(map.currentCoordinates(), move);
            console.log('QUEUED MOVES LEN', queuedMoves.length);
        }
    }, 300);

    function goToScreenPoint(x, y) {
        camera.debugDraw(x, y);
        console.log('screen', x, y);
        var coords = map.screenPointToMapCoord(x, y);
        console.log(map.currentCoordinates());
        console.log(coords);
        if (coords.length === 2) {
            var moves = astar(map.map, map.currentCoordinates(), coords);
            queuedMoves = [];

            while (moves.length > 0) {
                queuedMoves.push(moves.shift());
                console.log('MOVES LEN', moves.length);
            }
        }
    }

    if (window.map) map.generateMap();
    background.draw();
    var scale = background.scale;
    camera.updateScale(scale);
    var cords = map.startPos();
    camera.scrollTo(cords[0] - 2, cords[1] - 2);
    $('#character').css({
        top: (200 * scale) + 'px',
        left: (200 * scale) + 'px'
    });
    ui.showMessage('Spaceman');
})();