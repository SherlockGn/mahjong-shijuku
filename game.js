
function Game() {

    this.isRiich = false;
    this.handPais = [];
    this.droppedPais = [];
    this.kans = [];
    this.pais = [];
    this.ables = [];     /* the pais wihch can be dropped */
    this.tenpais = [];   /* tenpais if drop the index */
    this.buttons = {riich: false, kan: false, tsumo: false};
    
    this.round = 0, this.riichRound = 0, this.left = 30;
    
    this.outputMembers = function() {
        console.log("----------------------");
        for(var member in this) {
            if(typeof(this[member]) !== "function") {
                console.log(member + " =");
                console.log(this[member]);
            }
        }
    }
    
    this.initPaisCheated = function(head, last) {
        if(head.length > 13 + 17 + 14) {
            head = head.slice(0, 13 + 17 + 14);
        }
        if(head.length + last.length > 13 + 17 + 14) {
            last = last.slice(0, 13 + 17 + 14 - head.length);
        }
        last = last.reverse();
        var middleLength = 13 + 17 + 14 - last.length - head.length;
        var allPais = [];
        for(var i = 0; i < paiType.length; i++)
            for(var j = 0; j < 4; j++)
                allPais.push(paiType[i]);
        var middle = [];
        for(var i = 0; i < head.length; i++)
            allPais.splice(allPais.indexOf(head[i]), 1);
        for(var i = 0; i < last.length; i++)
            allPais.splice(allPais.indexOf(last[i]), 1);
        for(var i = 0; i < middleLength; i++) {
            var t = parseInt(Math.random() * allPais.length);
            var s = allPais[t];
            allPais.splice(t, 1);
            middle.push(s);
        }
        this.pais = head.concat(middle).concat(last);
    }
    
    this.initPaisTest = function() {
        this.initPaisRandom();
    }
    
    this.initPaisRandom = function() {
        /* 13(first) + 17(times) + 14(maintain) */
        var allPais = [];
        for(var i = 0; i < paiType.length; i++)
            for(var j = 0; j < 4; j++)
                allPais.push(paiType[i]);
        for(var i = 0; i < 13 + 17 + 14; i++) {
            var t = parseInt(Math.random() * allPais.length);
            var s = allPais[t];
            allPais.splice(t, 1);
            this.pais.push(s);
        }
    }
    
    /* return the unsorted hand pais */
    this.start = function() {
        for(var i = 0; i < 13; i++) {
            var s = this.pais.shift();
            this.handPais.push(s);
        }
        this.left -= 13;
        var oldHandPais = this.handPais.slice(0);
        this.handPais.sort(basicSort);
        return oldHandPais;
    }
    
    this.moPai = function() {
        var p = this.pais.shift();
        this.handPais.push(p);
        var canRiich = this.buttonRiichCheck();
        var canKan = this.buttonKanCheck();
        var canTsumo = this.buttonTsumoCheck();
        this.buttons = {riich: canRiich, kan: canKan, tsumo: canTsumo};
        
        if(this.isRiich === false)
            this.ables = seqArray(this.handPais.length);
        else this.ables = [this.handPais.length - 1];
        
        this.left--;
    }
    
    this.uchi = function(index) {
        
    }
    
    this.riichClick() {
        
    }
    
    this.kanClick() {
        
    }
    
    this.tsumoClick() {
        
    }
    
    /* private method */
    this.buttonRiichCheck = function() {
        var m = dropTenpai(this.handPais, this.kans);
        return m.size !== 0;
    }
    
    /* private method */
    this.buttonKanCheck = function() {
        if(this.isRiich === false) {
            var r = search4(this.handPais);
            return r.length !== 0;
        } else {
            var dropLast = this.handPais.slice(0).pop();
            var can = canKan(handPais.slice(0), this.kans, dropLast);
            return can;
        }
    }
    
    /* private method */
    this.buttonTsumoCheck = function() {
        return canAgari(this.handPais, this.kans);
    }
}

var game = new Game();
game.initPaisCheated([6,6,6,6,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5], []);
game.start();
game.outputMembers();
game.moPai();
game.outputMembers();

