(function () {


    var SPACE = 'S';
    var PATH = ' ';
    var AIRLOCK = 'a';
    var SLEEPING_QUARTERS = 'q';
    var BED = 'b';
    var RESTROOM = 'R';
    var SPACE2 = 'X';
    var SPARE_PART = 'p';
    var ENEMY = 'e';

    var playerDamage = null;
    var playerHealth = 10;
    var playerArmor = 2;

    function updateHealth() {
        $('#health span.val').text(playerHealth);
        console.log('Health Updated');
    }

    function updateArmor() {
        $('#armor span.val').text(playerArmor);
        console.log('Armor Updated');
    }


    var enemies = {};

    function createRandEnemy(coords) {
        var enemy = {
            health: Math.floor(Math.random() * 2) + 1,
            combat: Math.floor(Math.random() * 2) + 1
        };
        return enemy;
    }

    var fightClubInt;

    function fightClub(origCoords, enemy, enemyCoords) {
        var origX = origCoords[0];
        var origY = origCoords[1];

        var cur = map.currentCoordinates();
        curX = cur[0];
        curY = cur[1];

        if (curX === origX &&
            curY === origY) {
            // TODO add in combat and armor
            var ourAttack = Math.random();
            var enemyAttack = Math.random();
            console.log(ourAttack, '>=', enemyAttack);
            if (ourAttack >= enemyAttack) {
                enemy.health -= 1;
                ui.showMessage('Direct hit')
                if (enemy.health <= 0) {
                    ui.showMessage('It is dead.');
                    map.setTileType(PATH, enemyCoords[0], enemyCoords[1]);
                    window.camera.draw();
                    console.log('AOK', fightClubInt);
                    console.log('AOK', clearInterval(fightClubInt));
                    fightClubInt = undefined;
                    console.log('AOK', fightClubInt);
                    console.log('AOK enemy dead, clearing fight interval');
                    return;
                }
            } else {
                // combat and armor


                if (playerArmor <= 0) {
                    playerHealth -= 1;
                    ui.showMessage('Ouch');
                    updateHealth();
                } else {
                    playerArmor -= 1;
                    ui.showMessage('Clang');
                    updateArmor();
                    console.log('Lost 1 Armor');

                }

                    if (playerHealth <= 0) {
                        ui.showMessage('Game Over')
                        clearInterval(fightClubInt);
                        fightClubInt = undefined;
                        // TODO make a game over controller
                        setTimeout(function () {
                            $('h1').text('Game Over').show();
                        }, 1000);
                        mazeController.stopMainMazeScene();
                        console.log('Game over fight interval');
                        return;
                    }
                

            }


        } else {
            console.log('Moved, clearing fight interval');
            clearInterval(fightClubInt);
            fightClubInt = undefined;
            return;
        }
    }

    window.combat = {
        fight: function (ourCoords, theirCoords) {
            var enemyKey = theirCoords[0] + ',' + theirCoords[1];
            if (!enemies[enemyKey]) {
                enemies[enemyKey] = createRandEnemy(theirCoords);
            }
            var enemy = enemies[enemyKey];
            console.log("AOK ", fightClubInt);
            if (!fightClubInt) {

                fightClubInt = setInterval(function () {
                    console.log('Fight club yall');
                    fightClub(ourCoords, enemy, theirCoords);
                }, 1000);
            } else {

            }

        }
    }
})();