// 1 - 9         m
// 11 - 19       p
// 21 - 29       s
// 31 33 35 37   ton nan sha pei
// 41 43 45      haku hatu juu

function isShun(a, b, c) {
    var arr = [a, b, c];
    arr.sort();
    a = arr[0];
    b = arr[1];
    c = arr[2];
    var a1 = parseInt(a / 10);
    var b1 = parseInt(b / 10);
    var c1 = parseInt(c / 10);
    if (!(a1 === b1 && a1 === c1))
        return false;
    return (b === a + 1) && (c ==  b + 1);
}

function isKou(a, b, c) {
    return a === b && b === c;
}

function resultSetOutput(resultSet) {
    var ret = [];
    for(var i = 0; i < resultSet.length; i++) {
        var arr = resultSet[i].comp;
        var last = resultSet[i].last;
        var s = "";
        for(var x = 0; x < arr.length; x++) {
            s = s + "<";
            for(var y = 0; y < arr[x].length; y++) {
                s = s + arr[x][y];
                if(x === last.x && y === last.y)
                    s = s + "'";
                if(y !== arr[x].length - 1) s = s + " ";
            }
            s = s + ">"
            if(x != arr.length - 1) s = s + " ";
        }
        ret.push(s);
    }
    return ret;
}

function resultOutput(resultSet) {
    var ret = [];
    for(var i = 0; i < resultSet.length; i++) {
        var arr = resultSet[i];
        var s = "";
        for(var x = 0; x < arr.length; x++) {
            s = s + "<";
            for(var y = 0; y < arr[x].length; y++) {
                s = s + arr[x][y];
                if(y !== arr[x].length - 1) s = s + " ";
            }
            s = s + ">"
            if(x != arr.length - 1) s = s + " ";
        }
        ret.push(s);
    }
    return ret;
}

function handle(pais, kans, last) {
    if(kans === null)
        kans = [];
        
    // length check
    if(pais.length + kans.length * 3 !== 14) {
        return "error: length is not legal (" + (pais.length + kans.length * 3) + ")";
    }
    
    // range check
    var errorData;
    var allInRange = true;
    var normalRange = [1,2,3,4,5,6,7,8,9,11,12,13,14,15,16,17,18,19,21,22,23,24,25,26,27,28,29,
            31,33,35,37,41,43,45];
    for (var i = 0; i < pais.length; i++) {
        if(normalRange.indexOf(pais[i]) === -1) {
            allInRange = false;
            errorData = pais[i];
            break;
        }
    }
    for (var i = 0; i < kans.length; i++) {
        if(normalRange.indexOf(kans[i]) === -1) {
            allInRange = false;
            errorData = kans[i];
            break;
        }
    }
    if(allInRange === false)
        return "error: " + errorData + " is not legal";
        
    // last check
    if(pais.indexOf(last) === -1)
        return "error: last (" + last + ") is not in pais";
    
    // numbers check
    var numbers = new Map();
    for (var i = 0; i < pais.length; i++) {
        if(!numbers.has(pais[i]))
            numbers.set(pais[i], 1);
        else numbers.set(pais[i], numbers.get(pais[i]) + 1);
    }
    for (var i = 0; i < kans.length; i++) {
        if(!numbers.has(kans[i]))
            numbers.set(kans[i], 4);
        else numbers.set(kans[i], numbers.get(kans[i]) + 4);
    }
    
//  console.log(numbers);
    var allUnderFive = true;
    numbers.forEach(function(value, key) {
//      console.log(key + " -> " + value);
        if(value >= 5) {
            errorData = key;
            allUnderFive = false;
        }
    });
    if(allUnderFive === false)
        return "error: " + errorData + " is over 4 (" + numbers.get(errorData) + ")";
    
    var resultSet = [];
    pais.sort(function(a,b) {return a-b});
    kans.sort(function(a,b) {return a-b});
    
    var lastIndex = pais.indexOf(last);
    
    // chiitoitsu check
    var isChiitoitsu = true, keyTpAry = [];
    var double2Key = null;
    if(kans.length > 0) isChiitoitsu = false;
    numbers.forEach(function(value, key) {
        if(value != 2) {
            isChiitoitsu = false;
        } else {
            double2Key = key;
        }
        keyTpAry.push(key);
    });
    keyTpAry.sort(function(a,b) {return a-b});
    if(isChiitoitsu) {
        var compArr = [];
        for(var i = 0; i < keyTpAry.length; i++)
            compArr.push([keyTpAry[i], keyTpAry[i]]);
        resultSet.push({
            comp: compArr,
            last: {x: parseInt(lastIndex/2), y: 1}
        })
    }
    
    // kokushimusou check
    var isKokushimusou = keyTpAry.toString() === [1,9,11,19,21,29,31,33,35,37,41,43,45].toString();
    if(isKokushimusou) {
        var compArr = [];
        for(var i = 0; i < keyTpAry.length; i++) {
            if(keyTpAry[i] === double2Key) compArr.push([double2Key, double2Key]);
            else compArr.push([keyTpAry[i]]);
        }
        resultSet.push({
            comp: compArr,
            last: {x: keyTpAry.indexOf(last), y: last === double2Key? 1: 0}
        });
    }
    
    // normal type 2 + 3 * 4
    for(var i = 0; i < kans.length; i++) {
        mapMinus(numbers, kans[i], 4);
    }
    var result = [];
    for(var i = 0; i < keyTpAry.length; i++) {
        // find head (janhai)
        if(numbers.get(keyTpAry[i]) >= 2) {
            var cpNumbers = new Map(numbers);
            cpNumbers.set(keyTpAry[i], cpNumbers.get(keyTpAry[i]) - 2);
            if(cpNumbers.get(keyTpAry[i]) === 0) cpNumbers.delete(keyTpAry[i]);
            var ret = handleNormal(cpNumbers);
            if(ret !== null) {
                for(var j = 0; j < ret.length; j++) {
                    ret[j].push([keyTpAry[i], keyTpAry[i]]);
                    result.push(ret[j]);
                }
            }
            // suukantsu tanki
            if(cpNumbers.size === 0) {
                ret = [];
                ret.push([keyTpAry[i], keyTpAry[i]]);
                result.push(ret);
            }
        }
    }
    
    // push kans & sort
    for(var i = 0; i < result.length;) {
        for(var j = 0; j < kans.length; j++) {
            result[i].push([kans[j],kans[j],kans[j],kans[j]]);
        }
        result[i].sort(function(x, y) {
            if(x.length != y.length)
                return x.length - y.length;
            if(x.length === 3 && y.length === 3) {
                if(isShun(x[0], x[1], x[2]) && isShun(y[0], y[1], y[2]))
                    return x[0] - y[0];
                if(isKou(x[0], x[1], x[2]) && isKou(y[0], y[1], y[2]))
                    return x[0] - y[0];
                if(isShun(x[0], x[1], x[2]) && isKou(y[0], y[1], y[2]))
                    return 1;
                if(isKou(x[0], x[1], x[2]) && isShun(y[0], y[1], y[2]))
                    return -1;
            }
        });
        if(i > 0 && result[i].toString() === result[i - 1].toString())
            result.splice(i, 1);
        else i++;
    }
    
    // add last judgement
    for(var i = 0; i < result.length; i++) {
        for(var j = 0; j < result[i].length; j++) {
            if(j !== result[i].length - 1 && result[i][j].toString() === result[i][j + 1].toString())
                continue;
            for(var k = 0; k < result[i][j].length; k++) {
                if(result[i][j][k] === last && !(k !== result[i][j].length - 1 && result[i][j][k] === result[i][j][k + 1]))
                    resultSet.push({comp: result[i], last: {x: j, y: k}});
            }
        }
    }
//    console.log(resultOutput(result));
    return resultSet;
}

function contains(arr, element) {
    return arr.indexOf(element) !== -1;
}

function mapMinus(map, key, value) {
    if(map.has(key)) {
        map.set(key, map.get(key) - value);
        if(map.get(key) <= 0)
            map.delete(key);
    }
}

function handleNormal(numbers) {

    var keyTpAry = [];
    var all = 0;
    numbers.forEach(function(value, key) {
        keyTpAry.push(key);
        all += value;
    });
    keyTpAry.sort(function(a,b) {return a-b});
    
    if(all === 3) {
        if(keyTpAry.length === 3 && isShun(keyTpAry[0], keyTpAry[1], keyTpAry[2]))
            return [[keyTpAry]];
        if(keyTpAry.length === 1)
            return [[[keyTpAry[0],keyTpAry[0],keyTpAry[0]]]];
        return null;
    }
    
    var ret = [];
    var baseElement = keyTpAry[0];
    var success = false;
    
    // contains base, base + 1, base + 2
    if(contains(keyTpAry, baseElement + 1) && contains(keyTpAry, baseElement + 2)) {
        var cpNumbers = new Map(numbers);
        mapMinus(cpNumbers, baseElement, 1);
        mapMinus(cpNumbers, baseElement + 1, 1);
        mapMinus(cpNumbers, baseElement + 2, 1);
        var result = handleNormal(cpNumbers);
        if(result !== null) {
            success = true;
            for(var i = 0; i < result.length; i++){
                result[i].push([baseElement, baseElement + 1, baseElement + 2]);
                ret.push(result[i]);
            }
        }
    }

    // contains base, base, base
    if(numbers.get(baseElement) >= 3) {
        var cpNumbers = new Map(numbers);
        mapMinus(cpNumbers, baseElement, 3);
        var result = handleNormal(cpNumbers);
        if(result !== null) {
            success = true;
            for(var i = 0; i < result.length; i++){
                result[i].push([baseElement, baseElement, baseElement]);
                ret.push(result[i]);
            }
        }
    }
    
    return success? ret: null;
}

function calculateAllResult(resultSet, riichRound, agariRound, leftPais, isRinshan, jifuu/*0,1,2,3 -> t,n,s,p*/, doraGuider) {
    var res = null
    for(var i = 0; i < resultSet.length; i++) {
        var r = calculateHanAndFu(resultSet[i], riichRound, agariRound, leftPais, isRinshan, jifuu, doraGuider);
        if(res === null || res.point < r.point)
            res = r;
        if(res.point === r.point && res.yakumanHanNumber === res.yakumanHanNumber && res.hanNumber < r.hanNumber)
            res = r;
    }
    return res;
}

function containsSubArray(arr, subarr) {
    for(var i = 0; i < arr.length; i++) {
        if(arr[i].toString() === subarr.toString())
            return true;
    }
    return false;
}

function calculateHanAndFu(group, riichRound, agariRound, leftPais, isRinshan, jifuu/*0,1,2,3 -> t,n,s,p*/, doraGuider) {
    var fans = new Array();
    fans["riich"] = 1;
    fans["ippatsu"] = 1;
    fans["menzentsumo"] = 1;
    fans["pinfu"] = 1;
    fans["iipeikou"] = 1;
    fans["danyao"] = 1;
    fans["yakuhai"] = 0;
    fans["rinshankaihou"] = 1;
    fans["haiteiraoyue"] = 1;
    fans["double riich"] = 2;
    fans["chiitoitsu"] = 2;
    fans["chandai"] = 2;
    fans["ittsuu"] = 2;
    fans["sanshoku doujun"] = 2;
    fans["sanshoku doukou"] = 2;
    fans["san ankou"] = 2;
    fans["san kantsu"] = 2;
    fans["honroutou"] = 2;
    fans["shousangen"] = 2;
    fans["jun chandai"] = 3;
    fans["hon iisou"] = 3;
    fans["ryanpeikou"] = 3;
    fans["chin iisou"] = 6;
    fans["dora"] = 0;
    
    var kouNumber = 0, shunNumber = 0, manNumber = 0, pinNumber = 0, souNumber = 0, jiNumber = 0, partYaoNumber = 0, allYaoNumber = 0, partRoutouNumber = 0, allRoutouNumber = 0, kanNumber = 0, toiNumber = 0, totalNumber = 0;
    var tNumber = 0, nNumber = 0, sNumber = 0, pNumber = 0, hkNumber = 0, htNumber = 0, jNumber = 0;
    var headPai = null;
    
    totalNumber = group.comp.length;
    for(var i = 0; i < group.comp.length; i++) {
        var men = group.comp[i];
        if(men.length === 2) {
            toiNumber++;
            if(group.comp.length === 5)
                headPai = men[0];
            if(men[0] >= 31 || men[0] % 10 === 1 || men[0] % 10 === 9)
                allYaoNumber++;
            if(men[0] % 10 === 1 || men[0] % 10 === 9)
                allRoutouNumber++;
        } else if(men.length === 4) {
            kanNumber++;
            if(men[0] >= 31 || men[0] % 10 === 1 || men[0] % 10 === 9)
                allYaoNumber++;
            if(men[0] % 10 === 1 || men[0] % 10 === 9)
                allRoutouNumber++;
        }
        if(men.length === 3) {
            if(men[0] === men[1]) {
                kouNumber++;
                if(men[0] >= 31 || men[0] % 10 === 1 || men[0] % 10 === 9)
                    allYaoNumber++;
                if(men[0] % 10 === 1 || men[0] % 10 === 9)
                    allRoutouNumber++;
            }
            else {
                shunNumber++;
                if(men[0] % 10 === 1 || men[2] % 10 === 9) {
                    partYaoNumber++;
                    partRoutouNumber++;
                }
            }
        }
        if(men[0] >= 1 && men[0]<= 9) manNumber++;
        if(men[0] >= 11 && men[0] <= 19) pinNumber++;
        if(men[0] >= 21 && men[0] <= 29) souNumber++;
        if(men[0] >= 31) jiNumber++;
        if(men[0] === 31) tNumber += men.length;
        if(men[0] === 33) nNumber += men.length;
        if(men[0] === 35) sNumber += men.length;
        if(men[0] === 37) pNumber += men.length;
        if(men[0] === 41) hkNumber += men.length;
        if(men[0] === 43) htNumber += men.length;
        if(men[0] === 45) jNumber += men.length;
    }
    
    var hanResult = [], fuResult = [];
    if(riichRound != null && riichRound > 0)
        hanResult.push("riich");
    if(riichRound != null && riichRound === 0)
        hanResult.push("double riich");
    if(riichRound != null && agariRound === riichRound + 1)
        hanResult.push("ippatsu");
    hanResult.push("menzentsumo");
    var isPinfu = false;
    if(group.comp.length === 5 && headPai !== 31 && headPai !== (31 + 2 * jifuu) && shunNumber === 4 && 
        (group.last.y === 0 && group.comp[group.last.x][group.last.y] % 10 !== 7 || 
        group.last.y === 2 && group.comp[group.last.x][group.last.y] % 10 !== 3)) {
        hanResult.push("pinfu");
        isPinfu = true;
    }
    var isRyanpeikou = false;
    if(group.comp.length === 5) {
        var ippeiNumber = 0;
        for(var i = 1; i < group.comp.length - 1; i++) {
            if(group.comp[i][0] != group.comp[i][1] && group.comp[i].toString() === group.comp[i + 1].toString()) {
                ippeiNumber++;
                i++;
            }
        }
        if(ippeiNumber === 1)
            hanResult.push("iipeikou");
        if(ippeiNumber === 2)
            isRyanpeikou = true;
        else isRyanpeikou = false;
    }
    if(partYaoNumber + allYaoNumber === 0) {
        hanResult.push("danyao");
    }
    if(group.comp.length === 5) {
        var yakuNumber = 0, hasYaku = false;
        if(tNumber >= 3) {
            yakuNumber++;
            hasYaku = true;
        }
        if(hkNumber >= 3) {
            yakuNumber++;
            hasYaku = true;
        }
        if(htNumber >= 3) {
            yakuNumber++;
            hasYaku = true;
        }
        if(jNumber >= 3) {
            yakuNumber++;
            hasYaku = true;
        }
        var jifuNumber;
        if(jifuu === 0) jifuNumber = tNumber;
        if(jifuu === 1) jifuNumber = nNumber;
        if(jifuu === 2) jifuNumber = sNumber;
        if(jifuu === 3) jifuNumber = pNumber;
        if(jifuNumber >= 3) {
            yakuNumber++;
            hasYaku = true;
        }
        if(hasYaku === true) {
            hanResult.push("yakuhai");
            fans["yakuhai"] = yakuNumber;
        }
    }
    if(isRinshan === true) {
        hanResult.push("rinshankaihou");
    }
    if(leftPais === 0) {
        hanResult.push("haiteiraoyue");
    }
    if(group.comp.length === 7) {
        hanResult.push("chiitoitsu")
    }
    if(group.comp.length === 5 && (partYaoNumber + allYaoNumber === 5) && partYaoNumber > 0 && jiNumber > 0) {
        hanResult.push("chandai");
    }
    if(group.comp.length === 5 && 
    ((containsSubArray(group.comp, [1,2,3]) && containsSubArray(group.comp, [4,5,6]) && containsSubArray(group.comp, [7,8,9])) || 
    (containsSubArray(group.comp, [11,12,13]) && containsSubArray(group.comp, [14,15,16]) && containsSubArray(group.comp, [17,18,19])) || 
    (containsSubArray(group.comp, [21,22,23]) && containsSubArray(group.comp, [24,25,26]) && containsSubArray(group.comp, [27,28,29])) )) {
        hanResult.push("ittsuu");
    }
    if(group.comp.length === 5) {
        var isSanshoku = false;
        for(var i = 1; i < group.comp.length; i++) {
            var a = group.comp[i][0], b = group.comp[i][1], c = group.comp[i][2];
            if(a !== b && a < 10 && (containsSubArray(group.comp, [a+10,b+10,c+10]) && containsSubArray(group.comp, [a+20,b+20,c+20]))) {
                isSanshoku = true;
                break;
            }
        }
        if(isSanshoku === true) {
            hanResult.push("sanshoku doujun");
        }
    }
    if(group.comp.length === 5) {
        var isSanshoku = false;
        for(var i = 1; i < group.comp.length; i++) {
            var a = group.comp[i][0], b = group.comp[i][1];
            var aa = a + 10, aaa = a + 20;
            if(a === b && a < 10 && (containsSubArray(group.comp, [aa,aa,aa]) || containsSubArray(group.comp, [aa,aa,aa,aa])) && 
                    (containsSubArray(group.comp, [aaa,aaa,aaa]) || containsSubArray(group.comp, [aaa,aaa,aaa,aaa])) ) {
                isSanshoku = true;
                break;
            }
        }
        if(isSanshoku === true) {
            hanResult.push("sanshoku doukou");
        }
    }
    if(group.comp.length === 5 && kouNumber + kanNumber === 3) {
        hanResult.push("san ankou");
    }
    if(group.comp.length === 5 && kanNumber === 3) {
        hanResult.push("san kantsu");
    }
    if((group.comp.length === 5 || group.comp.length === 7) && 
        (partYaoNumber + allYaoNumber === group.comp.length) && partYaoNumber === 0 && jiNumber > 0 && jiNumber < group.comp.length
        ) {
        hanResult.push("honroutou");
    }
    if(group.comp.length === 5 && ((
            hkNumber >= 3 && htNumber >= 3 && jNumber === 2) || (
            hkNumber >= 3 && htNumber === 2 && jNumber >= 3) || (
            hkNumber === 2 && htNumber >= 3 && jNumber >= 3))) {
        hanResult.push("shousangen");
    }
    if(group.comp.length === 5 && (partYaoNumber + allYaoNumber === 5) && partYaoNumber > 0 && jiNumber === 0
        ) {
        hanResult.push("jun chandai");
    }
    if((group.comp.length === 5 || group.comp.length === 7) && jiNumber > 0 && jiNumber < group.comp.length && (pinNumber + jiNumber === group.comp.length || manNumber + jiNumber === group.comp.length || souNumber + jiNumber === group.comp.length)) {
        hanResult.push("hon iisou");
    }
    if(isRyanpeikou === true) {
        hanResult.push("ryanpeikou");
    }
    var isChiniisou = false;
    if((group.comp.length === 5 || group.comp.length === 7) && jiNumber === 0 && (pinNumber === group.comp.length || manNumber === group.comp.length || souNumber === group.comp.length)) {
        hanResult.push("chin iisou");
        isChiniisou = true;
    }
    var doraNumber = 0;
    var pais = [];
    for(var i = 0; i < group.comp.length; i++) {
        for(var j = 0; j < group.comp[i].length; j++)
            pais.push(group.comp[i][j]);
    }
    pais.sort(function(a,b) {return a-b});
    for(var i = 0; i < doraGuider.length; i++) {
        var dorag = doraGuider[i];
        if(dorag <= 29) {
            dorag++;
            if(dorag % 10 === 0)
                dorag = dorag - 10 + 1;
        } else {
            dorag += 2;
            if(dorag === 39) dorag = 31;
            if(dorag === 47) dorag = 41;
        }
        for(var j = 0; j < pais.length; j++) {
            if(pais[j] === dorag) doraNumber++;
        }
    }
    if(doraNumber > 0) {
        hanResult.push("dora");
        fans["dora"] = doraNumber;
    }
    
    var yakumanFans = [];
    // yakuman judgement
    if(agariRound === 0) {
        if(jifuu === 0) yakumanFans.push("tenhou");
        else yakumanFans.push("chihou");
    }
    if(group.comp.length === 13) {
        var cppais = pais.slice(0);
        var last = group.comp[group.last.x][group.last.y];
        cppais.splice(cppais.indexOf(last), 1);
        if(cppais.indexOf(last) === -1)
            yakumanFans.push("kokushimusou");
        else yakumanFans.push("kokushimusou juusanmen");
    }
    if(group.comp.length === 5 && isChiniisou === true) {
        var tppais = new Array(10);
        for(var i = 1; i < 10; i++) {
            tppais[i] = 0;
        }
        for(var i = 0; i < pais.length; i++) {
            tppais[pais[i] % 10]++; 
        }
        var success = true, over = -1;
        for(var i = 1; i <= 9; i++) {
            var n = (i === 1 || i === 9)? 3: 1;
            if(tppais[i] < n) {
                success = false;
                break;
            }
            if(tppais[i] > n) over = i;
        }
        if(success === true) {
            var last = group.comp[group.last.x][group.last.y];
            if(over === last % 10)
                yakumanFans.push("junsei chuurenpoudou");
            else yakumanFans.push("chuurenpoudou");
        }
    }
    if(kouNumber + kanNumber === 4) {
        var cppais = pais.slice(0);
        var last = group.comp[group.last.x][group.last.y];
        cppais.splice(cppais.indexOf(last), 2);
        if(cppais.indexOf(last) !== -1)
            yakumanFans.push("suu ankou");
        else yakumanFans.push("suu ankou tankimachi");
    }
    if(kanNumber === 4) {
        yakumanFans.push("suu kantsu");
    }
    if(group.comp.length === 5 && (partYaoNumber + allYaoNumber === 5) && partYaoNumber === 0 && jiNumber === 0) {
        yakumanFans.push("chinroutou");
    }
    if(group.comp.length === jiNumber) {
        yakumanFans.push("tsuuiisou");
    }
    if(group.comp.length === 5 && ((
            tNumber ===2 && nNumber >= 3 && sNumber >= 3 && pNumber >= 3) || (
            tNumber >= 3 && nNumber ===2 && sNumber >= 3 && pNumber >= 3) || (
            tNumber >= 3 && nNumber >= 3 && sNumber ===2 && pNumber >= 3) || (
            tNumber >= 3 && nNumber >= 3 && sNumber >= 3 && pNumber ===2))) {
        yakumanFans.push("shousuushii");
    }
    if(group.comp.length === 5 && ((
            tNumber >= 3 && nNumber >= 3 && sNumber >= 3 && pNumber >= 3))) {
        yakumanFans.push("daisuushii");
    }
    if(group.comp.length === 5) {
        var isRyuuiisou = true;
        var greenPais = [22,23,24,26,28,43];
        for(var i = 0; i < pais.length; i++) {
            if(greenPais.indexOf(pais[i]) === -1) {
                isRyuuiisou = false;
                break;
            }
        }
        if(isRyuuiisou === true)
            yakumanFans.push("ryuuiisou");
    }
    
    // calculation of fu
    var base = 20;
    if(group.comp.length !== 5) base = 25;
    if(group.comp.length === 5) {
        if(isPinfu === false) base += 2;
        if(headPai === 31) base += 2;
        if(headPai === 31 + 2 * jifuu) base += 2;
        var lastMen = group.comp[group.last.x];
        var last = lastMen[group.last.y];
        if(lastMen[0] !== lastMen[1]) {  // shun
            if(group.last.y === 1) base += 2;   //chan
            else {
                if(group.last.y === 0 && last % 10 === 7)
                    base += 2;
                if(group.last.y === 2 && last % 10 === 3)
                    base += 2;
            }
        }
        for(var i = 0; i < group.comp.length; i++) {
            if(group.comp[i].length === 3 && group.comp[i][0] === group.comp[i][1]) {  // kou
                var x = group.comp[i][0];
                if(x >= 31 || x % 10 === 1 || x % 10 === 9)
                    base += 8;
                else base += 4;
            }
            if(group.comp[i].length === 4) {  // kan
                var x = group.comp[i][0];
                if(x >= 31 || x % 10 === 1 || x % 10 === 9)
                    base += 32;
                else base += 16;
            }
        }
        if(base % 10 !== 0) base = base - (base % 10) + 10;
    }
    
    var fan = 0;
    for(var i = 0; i < hanResult.length; i++) {
        fan += fans[hanResult[i]];
    }
    var yakumanFan = yakumanFans.length;
    var yakumanFlag = false;
    var showTinyPoints = (yakumanFan === 0);
    var point;
    var oyaPoints = [
        /*   20,   25,   30,   40    50,   60,   70,   80,   90,  100   110*/
        [     0,    0, 1500, 2100, 2400, 3000, 3600, 3900, 4500, 4800,    0],   /*1 han*/
        [  2100,    0, 3000, 3900, 4800, 6000, 6900, 7800, 8700, 9600,10800],   /*2 han*/
        [  3900, 4800, 5800, 7700, 9600,11600,12000,12000,12000,12000,12000],   /*3 han*/
        [  7800, 9600,11700,12000,12000,12000,12000,12000,12000,12000,12000]    /*4 han*/
    ];
    var koPoints = [
        /*   20,   25,   30,   40    50,   60,   70,   80,   90,  100   110*/
        [     0,    0, 1100, 1500, 1600, 2000, 2400, 2800, 3100, 3200,    0],   /*1 han*/
        [  1500,    0, 2000, 2700, 3200, 4000, 4700, 5200, 5900, 6200, 7200],   /*2 han*/
        [  2700, 3200, 4000, 5200, 6400, 7900, 8000, 8000, 8000, 8000, 8000],   /*3 han*/
        [  5200, 6400, 7900, 8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000]    /*4 han*/
    ];
    if(yakumanFan === 0) {
        if(fan <= 4) {
            var ind = 0;
            if(base === 20) ind = 0;
            else if(base === 25) ind = 1;
            else ind = base / 10 - 1;
            point = (jifuu === 0? oyaPoints[fan - 1][ind]: koPoints[fan - 1][ind]);
        } else {
            if(fan === 5) point = (jifuu === 0? 12000: 8000);
            if(fan === 6 || fan === 7)  point = (jifuu === 0? 18000: 12000);
            if(fan === 8 || fan === 9 || fan === 10) point = (jifuu === 0? 24000: 16000);
            if(fan === 11 || fan === 12) point = (jifuu === 0? 36000: 24000);
            if(fan >= 13) {
                point = (jifuu === 0? 48000: 32000);
                yakumanFlag = true;
            }
        }
    } else {
        point = jifuu === 0? (yakumanFan * 48000): (yakumanFan * 32000);
        yakumanFlag = true;
    }
//  console.log(hanResult);
//  console.log(yakumanFans);
//  console.log(base);
//  console.log(fan + ", " + yakumanFan + ", " + point);
    
    return {
        hanResult: hanResult,   /* all han's names */
        yakumanFans: yakumanFans, /* all yakuman han's names */
        hansConsult: fans,             /* consult yakuhai & dora number */
        showTinyPoints: showTinyPoints, /* if showing tiny points (eg. riich, dora) is needed */
        yakumanFlag: yakumanFlag,   /* if achieves yakuman (direct & counted) */
        hanNumber: fan, /* the number of tiny hans*/
        yakumanHanNumber: yakumanFans.length, /* the number of yakuman hans*/
        fu: base,   /* fu */
        point: point,   /* point achieved */
    }
}

function tenpai(pais, kans) {
    var res = [];
    for(var i = 1; i < 45; i++) {
        if(i %10 === 0) continue;
        if(i > 30 && i % 2 === 0) continue;
        var tpArrPais = pais.slice(0);
        tpArrPais.push(i);
        var ret = handle(tpArrPais, kans, i);
        if(!(typeof(ret) === "string" || ret.length === 0)) {
            res.push(i);
        }
    }
    return res;
}

/* return map: dropIndex -> {droppai: xx, tenpai:[xx,xx...]}*/
function dropTenpai(pais, kans) {
    var res = new Map();
    for(var i = 0; i < pais.length; i++) {
        var tpArrPais = pais.slice(0);
        var pai = tpArrPais[i];
        tpArrPais.splice(i, 1);
        var tpai = tenpai(tpArrPais, kans);
        if(tpai.length > 0) {
            res.set(i, {droppai: pai, tenpai: tpai});
        }
    }
    return res;
}

/* basic sort function */
function basicSort(a, b) {return a - b;}

/* generate sequence array 0~n */
function seqArray(n) {
    var ret = [];
    for(var i = 0; i < n; i++)
        ret.push(i);
    return ret;
}

/* search 4 same pais (unsorted), indexes returned */
function search4(pais) {
    var ret = [];
    for(var i = 0; i < pais.length; i++) {
        var next = [];
        for(var j = i + 1; j < pais.length; j++) {
            if(pais[i] === pais[j]) next.push(j);
        }
        if(next.length === 3) {
            ret = ret.concat(next);
            ret.push(i);
        }
    }
    ret.sort(basicSort);
    return ret;
}

/* judge if agari */
function canAgari(pais, kans) {
    var ret = handle(pais.slice(0), kans, pais[pais.length - 1]);
    if(typeof(ret) === "string") return false;
    return ret.length !== 0;
}

/* judge if player can do kan operation */
function canKan(pais, kans, get) {
    var ten1 = tenpai(pais, kans);
    var tp = pais.slice(0);
    if(tp.indexOf(get) === -1) return false;
    tp.splice(tp.indexOf(get), 1);
    if(tp.indexOf(get) === -1) return false;
    tp.splice(tp.indexOf(get), 1);
    if(tp.indexOf(get) === -1) return false;
    tp.splice(tp.indexOf(get), 1);
    kans.push(get);
    var ten2 = tenpai(tp, kans);
    return ten1.toString() === ten2.toString();
}

/* sort algorithm, return a map index -> arr[index] (oldindex -> newindex) */
function mysort(arr) {
    var len = arr.length;
    var seqArr = seqArray(len);
    for(var i = 0; i < len - 1; i++) {
        var min = i + 1;
        for(var j = i + 1; j < len; j++) {
            if(arr[j] < arr[min]) min = j;
        }
        if(arr[min] < arr[i]) {
            var tp = arr[min];
            arr[min] = arr[i];
            arr[i] = tp;
            tp = seqArr[min];
            seqArr[min] = seqArr[i];
            seqArr[i] = tp;
        }
    }
    var seqArr2 = new Array(len);
    for(var i = 0; i < len; i++) {
        var find = -1;
        for(var j = 0; j < len; j++)
            if(seqArr[j] === i) {find = j; break; }
        seqArr2[i] = find;
    }
    return seqArr2;
}

/**/
function keySet(map) {
    var keys = [];
    map.forEach(function(value, key) {
        keys.push(key);
    });
    keys.sort(basicSort);
    return keys;
}

/* global variables */
var paiType = [1,2,3,4,5,6,7,8,9,11,12,13,14,15,16,17,18,19,21,22,23,24,25,26,27,28,29,31,33,35,37,41,43,45];