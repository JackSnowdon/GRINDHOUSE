//  Below creates localStorage for Saving/Loading

window.localStorage;

$(document).ready(function() {

    // Player Object

    var player = new Object();
    player.maxHp = 100;
    player.currentHp = 100;
    player.power = 12;
    player.speed = 20;
    player.gold = 500;
    player.xp = 5000;
    player.level = 1;

    // Enemy Object

    var enemy = new Object();
    enemy.name = "Steve";
    enemy.maxHp = 100;
    enemy.currentHp = 100;
    enemy.power = 10;

    // Setup Functions

    function setPlayerStats() {
        $("#playerName").text(player.name);
        $("#playerHealth").text(player.currentHp);
        $("#playerMaxHp").text(player.maxHp);
        $("#playerGold").text(player.gold);
        $("#playerXp").text(player.xp);
        $("#playerPower").text(player.power);
        $("#playerSpeed").text(player.speed);
        $("#playerLevel").text(player.level);
    }

    function emptyResults() {
        $("#winnerResult").empty();
        $("#playerHitResult").empty();
        $("#enemyHitResult").empty();
        $("#goldResult").empty();
        $("#xpResult").empty();
    }

    // Combat Functions

    // getDieRoll takes amount of "sides" as a parameter

    function getDiceRoll(x) {
        return Math.floor(Math.random() * x) + 1;
    }

    function getRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function attack(base, power) {
        return base + power;
    }

    function basicAttack(p) {
        let baseDmg = getDiceRoll(p);
        let modDmg = getDiceRoll(baseDmg) * 2;
        let aDmg = attack(baseDmg, modDmg);
        return aDmg
    }

    function startCombat() {
        emptyResults()
        $("#hitresults").show();
        $(".buttons").fadeOut("slow");
        $("#enemyName").text(enemy.name);
        $("#enemyHealth").text(enemy.currentHp);
        $("#enemyMaxHp").text(enemy.maxHp);
        $(".save").fadeOut("slow");
        setTimeout(function() {
            $(".combat").fadeIn("slow");
        }, 1000);
        $("#attackButton").attr("disabled", false);
    }

    function doesAttackHit(a, d) {
        let aSpeed = (getDiceRoll(a.speed) + a.speed)
        let dSpeed = (getDiceRoll(d.speed) + getDiceRoll(d.speed))
        if (aSpeed >= dSpeed) {
            return true;
        } else {
            return false;
        }
    }

    function playerAttack() {
        // Empties Crit and disables attack button

        $("#attackButton").attr("disabled", true);
        $("#enemyCrit").empty()

        // Check To Hit

        if (doesAttackHit(player, enemy)) {

            // Check for Crit

            if (getDiceRoll(100) > 90) {
                $("#playerCrit").show().text("Crit!").css("color", "red");
                attackDmg = basicAttack(enemy.power) * 5;
            } else {
                attackDmg = basicAttack(enemy.power);
            }

            // Reduces enemy health and displays results

            enemy.currentHp -= attackDmg;
            $("#playerHitResult").html(player.name + " Hits " + enemy.name + " for " + attackDmg + " Hit Points!");
            $("#enemyHealth").html(enemy.currentHp);
        } else {
            $("#playerHitResult").html(player.name + " Misses " + enemy.name);
        }
    }

    function enemyAttack() {
        $("#playerCrit").empty()
        if (doesAttackHit(enemy, player)) {
            if (getDiceRoll(100) > 90) {
                $("#enemyCrit").show().text("Crit!").css("color", "red");
                eAttackDmg = basicAttack(enemy.power) * 5;
            } else {
                eAttackDmg = basicAttack(enemy.power);
            }
            player.currentHp -= eAttackDmg;
            $("#enemyHitResult").html(enemy.name + " Hits " + player.name + " for " + eAttackDmg + " Hit Points!");
            $("#playerHealth").text(player.currentHp);
        } else {
            $("#enemyHitResult").html(enemy.name + " Misses " + player.name);
        }
        $("#attackButton").attr("disabled", false);
    }

    // Endgame checker

    function areYouDead(hp) {
        return hp <= 0;
    }

    // Restart 

    function resetCombat() {
        player.currentHp = player.maxHp;
        $("#hitresults").fadeOut("slow");
        $("#enemyHealth").html(enemy.maxHp);
        $("#playerHealth").html(player.currentHp);
        $("#playerGold").html(player.gold);
        $("#playerXp").html(player.xp);
        $(".combat").fadeOut("slow");
        $("#enemyCrit").empty()
        $("#playerCrit").empty()
        setTimeout(function() {
            $(".buttons").fadeIn("slow");
            $(".save").fadeIn("slow");
        }, 1500)
    }

    // Gameplay Flow

    $("#name-sumbit").click(function() {
        // Checks name has value (Trimmed in case of whitespace)
        var playerName = $("#player-name").val();
        $(".name").fadeOut("slow");
        $(".load").fadeOut("slow");
        if ($.trim(playerName) == '') {
            alert('You surely must have a name!');
            $(".name").fadeIn("slow");
        } else {
            player.name = playerName;
        }
        if (typeof player.name !== "undefined") {
            setPlayerStats();
            setTimeout(function() {
                $(".save").fadeIn("slow");
                $(".buttons").fadeIn("slow");
                $(".stat-nav").fadeIn("slow");
            }, 1000);
        }
    });

    function setEnemyHealth(b) {
        let base = player.level * Math.floor(b / 10);
        let mod = Math.floor(getDiceRoll(b) / 2);
        let final = b + mod + base;
        return final;
    }

    function setEnemyStats() {

    }

    $("#startEasy").click(function() {
        enemy.name = "Easy";
        enemy.maxHp = setEnemyHealth(100);
        enemy.currentHp = enemy.maxHp;
        enemy.speed = 15 + player.level;
        enemy.power = 10;
        startCombat();
    })

    $("#startMedium").click(function() {
        enemy.name = "Medium";
        enemy.maxHp = setEnemyHealth(150);
        enemy.currentHp = enemy.maxHp;
        enemy.speed = Math.floor(20 + (player.level * 1.3));
        enemy.power = 12;
        startCombat();
    })

    $("#startHard").click(function() {
        enemy.name = "Hard";
        enemy.maxHp = setEnemyHealth(200);
        enemy.currentHp = enemy.maxHp;
        enemy.speed = Math.floor(25 + (player.level * 1.8));
        enemy.power = 15;
        startCombat();
    })

    // Player Attack

    $("#attackButton").click(function() {
        playerAttack();
        // Checks if enemy HP is below 0 and ends combat
        if (areYouDead(enemy.currentHp)) {
            printResults("#enemyHealth", 2, player)
            return;
        }

        // Enemy Attack

        setTimeout(function() {
            enemyAttack();
            if (areYouDead(player.currentHp)) {
                $("#attackButton").attr("disabled", true);
                printResults("#playerHealth", 1, enemy)
                return;
            }
        }, 1000);
    })

    // Combat Rewards

    function printResults(x, y, z) {
        $(x).html(0);
        earnGold(enemy.maxHp * y);
        earnXp(enemy.maxHp * y);
        $("#winnerResult").html(z.name + " Wins!");
        setTimeout(function() {
            resetCombat()
        }, 1500)
    }

    function earnGold(g) {
        g += g / 10;
        let gBase = getRange(getDiceRoll(g + 10), g + 25);
        player.gold += gBase;
        $("#goldResult").html("Earnt " + gBase + " Gold!");
    }

    function earnXp(x) {
        let xBase = getRange(getDiceRoll(x + 15), x + 30);
        player.xp += xBase;
        $("#xpResult").html("Earnt " + xBase + " XP!");
    }

    // Die

    $("#rollD6").click(function() {
        var result = getDiceRoll(6);
        $("#d6").text(result);
    });

    // Shop

    $("#enterShop").click(function() {
        emptyResults()
        $(".buttons").fadeOut("slow");
        setUpgradeAmount(player.power, "#powerUpgrade");
        setUpgradeAmount(player.speed, "#speedUpgrade");
        setTimeout(function() {
            $(".shop").fadeIn("slow");
        }, 1000);
    })

    $("#buyPower").click(function() {
        let powerAmount = $("#powerUpgrade").text();
        if (player.gold >= powerAmount) {
            player.gold -= powerAmount;
            player.power += 2;
            $("#playerGold").text(player.gold);
            $("#playerPower").text(player.power);
            setUpgradeAmount(player.power, "#powerUpgrade");
            alert("Power upgrade purchased!");
        } else {
            alert("You dont have enough gold! You need " + powerAmount + " Gold!");
        }
    })

    $("#buySpeed").click(function() {
        let speedAmount = $("#speedUpgrade").text();
        if (player.gold >= speedAmount) {
            player.gold -= speedAmount;
            player.speed += 1;
            $("#playerGold").text(player.gold);
            $("#playerSpeed").text(player.speed);
            setUpgradeAmount(player.speed, "#speedUpgrade");
            alert("Speed upgrade purchased!");
        } else {
            alert("You dont have enough gold! You need " + speedAmount + " Gold!");
        }
    })

    function setUpgradeAmount(a, t) {
        let base = Math.floor(a * 12);
        $(t).text(base);
    }

    $("#leaveShop").click(function() {
        $(".shop").fadeOut("slow");
        setTimeout(function() {
            $(".buttons").fadeIn("slow");
        }, 1000);
    })

    // Training

    $("#enterTraining").click(function() {
        emptyResults()
        $(".buttons").fadeOut("slow");
        setLevelUpAmount(player.level, "#levelUpgrade");
        setTimeout(function() {
            $(".training").fadeIn("slow");
        }, 1000);
    })

    $("#buyLevel").click(function() {
        let levelAmount = $("#levelUpgrade").text();
        if (player.xp >= levelAmount) {
            player.xp -= levelAmount;
            player.level += 1;
            player.maxHp += 10;
            player.currentHp = player.maxHp;
            $("#playerHealth").text(player.currentHp);
            $("#playerMaxHp").text(player.maxHp);
            $("#playerXp").text(player.xp);
            $("#playerLevel").text(player.level);
            setLevelUpAmount(player.level, "#levelUpgrade");
            alert("Leveled Up!");
        } else {
            alert("You dont have enough XP! You need " + levelAmount + "xp to Level Up!");
        }
    })

    function setLevelUpAmount(l, t) {
        let base = Math.floor(1.1 * (l * 1000));
        $(t).text(base);
    }

    $("#leaveTraining").click(function() {
        $(".training").fadeOut("slow");
        setTimeout(function() {
            $(".buttons").fadeIn("slow");
        }, 1000);
    })

    // Save System

    $("#saveButton").click(function() {

        // Confirms if player wants to save progress

        var saveCheck = confirm("Saving will overwrite " + player.name + "'s save, press OK to confirm");
        if (saveCheck == true) {
            save();
        } else {
            alert("Game not saved");
        }
    });

    function checkSave() {
        let loadTester = JSON.parse(localStorage.getItem("save"));
        console.log(loadTester);
        if (loadTester === null) {

            $(".load").css("display", "none");
        }
    }

    checkSave();

    $("#loadButton").click(function() {

        // Confirms player wants to load local save

        var loadCheck = confirm("Load your save file? (This will overwrite your current save)");
        if (loadCheck == true) {
            load();

            // Loads from local storage and sets player stats

            setPlayerStats();
            $(".name").fadeOut("slow");
            $(".load").fadeOut("slow");
            setTimeout(function() {
                $(".buttons").fadeIn("slow");
                $(".stat-nav").fadeIn("slow");
                $(".save").fadeIn("slow");
            }, 1000);

        } else {
            alert("Game not loaded");
        }
    });

    $("#deleteButton").click(function() {
        var deleteCheck = confirm("Delete your save file?");
        if (deleteCheck == true) {
            clearSave();
            $(".buttons").fadeOut("slow");
            $(".stat-nav").fadeOut("slow");
            $(".save").fadeOut("slow");
            setTimeout(function() {
                $(".name").fadeIn("slow");
            }, 1000)
        } else {
            alert("Game not deleted");

        }

    })

    function save() {

        // Stores player info as JSON and saves to local storage

        var save = {
            playerPower: player.power,
            playerMaxHp: player.maxHp,
            playerCurrentHp: player.currentHp,
            playerSpeed: player.speed,
            playerGold: player.gold,
            playerXp: player.xp,
            playerLevel: player.level,
            playerName: player.name
        };
        localStorage.setItem("save", JSON.stringify(save));
    }

    function load() {

        // Retrives from local storage

        var saveGame = JSON.parse(localStorage.getItem("save"));
        if (saveGame != null && saveGame != undefined) {
            player.power = saveGame.playerPower;
            player.maxHp = saveGame.playerMaxHp;
            player.currentHp = saveGame.playerCurrentHp;
            player.speed = saveGame.playerSpeed;
            player.gold = saveGame.playerGold;
            player.xp = saveGame.playerXp;
            player.level = saveGame.playerLevel;
            player.name = saveGame.playerName;

        }
    }

    function clearSave() {
        localStorage.clear()
    }


});