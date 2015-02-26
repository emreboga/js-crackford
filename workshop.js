// ALL QUESTIONS BELOW: http://www.crockford.com/pp/problems.pptx

function log (arg) {
    console.log(arg);
}


function identity (x) {
    return x;
}
// log(identity(3));


function add (x, y) {
    return x + y;
}
function sub (x, y) {
    return x - y;
}
function mul (x, y) {
    return x * y;
}
// log(add(3, 4));
// log(sub(3, 4));
// log(mul(3, 4));


function identityf (x) {
    return function () {
        return x;
    };
}
// log(identityf(3)());


// Write an addf function that takes two arguments and adds them.
// addf(3)(4) = 7
function addf(x) {
    return function (y) {
        return add(x, y);
    };
}
// log(addf(3)(4));


// Write a function liftf that takes a function and makes it callable with two arguments.
// liftf(add)(3)(4) = 7
function liftf (binary) {
    return function (x) {
        return function (y) {
            return binary(x, y);
        };
    };
}
// log(liftf(add)(3)(4));


// Write a function curry that takes a function and an argument, and returns a function that can take a second argument.
function curry (binary, x) {
    return function (y) {
        return binary(x, y);
    }
}
function curry2 (binary, x) {
    return liftf(binary)(x);
}
// log(curry(add, 3)(4));
// log(curry2(add, 3)(4));


// Without writing any function, implement the below result by using above functions.
// inc(5) = 6
// inc(inc(5)) = 7
var inc = addf(1);
var inc2 = liftf(add)(1);
var inc3 = curry(add, 1);
// log(inc(5));
// log(inc(inc(5)));


// Write a function 'twice' that takes a binary function and returns a unary function, 
// that passes its argument to the binary function twice.
function twice (binary) {
    return function (x) {
        return binary(x, x)
    };
}
var doubl = twice(add);
var square = twice(mul)
// log(doubl(11));
// log(square(11));


// Write a 'reverse' function that reverses the arguments of a binary function
function reverse (binary) {
    return function (x, y) {
        return binary(y, x);
    }
}
var bus = reverse(sub);
// log(bus(3, 2));


// Write a function 'composeu' that takes two unary functions and returns a unary function that calls them both.
// composeu(doubl, square)(5) = 100
function composeu (unary1, unary2) {
    return function (x) {
        return unary2(unary1(x));
    }
}
// log(composeu(doubl, square)(5));


// Write a function 'composeb' that takes two binary functions and returns a function that calls them both.
// composeb(add, mul)(2, 3, 7) = 35
function composeb (binary1, binary2) {
    return function (x, y, z) {
        return binary2(binary1(x, y), z);
    }
}
// log(composeb(add, mul)(2, 3, 7));


// Write a function 'once' that takes a binary function as an argument and lets it called only once, returns undefined for subsequent calls.
// var add_once = once(add);
// add_once(3, 4) = 7
// add_once(3, 4) = undefined;
function once (binary) {
    var flag = true;
    return function (x, y) {
        if (flag) {
            flag = false;
            return binary(x, y);
        } else {
            return undefined;
        }
    }
}
var add_once = once(add);
// log(add_once(3, 4));
// log(add_once(3, 4));


// Write a 'fromTo' function that takes two arguments and returns them in incremental order one by one
// and undefined if there are no more.
function fromTo (x, y) {
    var location = x - 1;
    return function () {
        if (location < y - 1) {
            location = location + 1;
            return location;
        } else {
            return undefined;
        }
    }
}
function fromTo2 (from, to) {
    return function () {
        var value = from;
        if (value < to) {
            from += 1;
            return value;
        }
    }
}
var index = fromTo(0, 3);
var index2 = fromTo2(0, 3);
// log(index());
// log(index());
// log(index());
// log(index());


// Write an 'element' function that takes an array and an optional generator and produces a generator that
// will produce the elements of the array
function element (array, generator) {
    var index = 0;
    if(generator) {
        return function () {
            return array[generator()];
        };
    } else {
        return function () {
           if (index < array.length) {
                var value = array[index];
                index += 1;
                return value;
           }
        };
    }
}
function element2 (array, gen) {
    if (gen === undefined) {
        gen = fromTo(0, array.length);
    }

    return function () {
        return array[gen()];
    }
}
var ele = element(['a', 'b', 'c', 'd'], fromTo(1, 3));
// log(ele());
// log(ele());
// log(ele());


// Write a function 'collect' that takes a generator and an array and produces a function that will collect
// the results in the array
function collect (gen, array) {
    return function () {
        var value = gen();
        if (value !== undefined) {
            array.push(value);
        }
        return value;
    };
}
var array = [];
col = collect(fromTo(5, 7), array);
// log(col());
// log(col());
// log(col());
// log(array);


// Write a filter function that takes a generator and a predicate and produces a generator
// that produces only the values approved by the predicate.
function filter (gen, predicate) {
    return function() {
        var value;
        while (!predicate(value = gen()) && value !== undefined);
        return value;
    }
}
function filter2 (gen, predicate) {
    return function() {
        var value;
        do {
            value = gen();
        }
        while (value !== undefined && !predicate(value));
        return value;
    }
}
var fil = filter(fromTo(0, 7), 
    function third (value) {
        return (value % 3) === 0;
    });
// log(fil());
// log(fil());
// log(fil());


// Write a concat function that takes two generators and produces a generator
// that combines the squence.
function concat (gen1, gen2) {
    return function () {
        var value = gen1();
        if (value === undefined) {
            value = gen2();
        }
        return value;
    }
}
function concat2 (gen1, gen2) {
    return function () {
        var value;
        if (gen1 !== undefined) {
            value = gen1();
            if (value !== undefined) {
                return value;
            }
            gen1 = undefined;
        }
        return gen2();
    }
}
var con = concat(fromTo(0, 3), fromTo(0, 2));
// log(con());
// log(con());
// log(con());
// log(con());
// log(con());
// log(con());


// Write a function 'counter' that returns an object containing two functions that implement
// an up/down counter, hiding the counter
function counter (value) {
    return {
        next: function () {
            value += 1;
            return value;
        },
        prev: function () {
            value -= 1;
            return value;
        }
    };
}
var object = counter(10), 
    next = object.next, 
    prev = object.prev;
// log(next());
// log(prev());
// log(prev());
// log(next());


// Write a function 'revocable' that takes a unary function, and returns an object containing an 'invoke' function
// that can invoke the unary function, and a 'revove' function tht disables the invoke function.
function revocable (unary) {
    var flag = true;
    return {
        invoke: function (value) {
            if (flag){
                return unary(value);
            }
        },
        revoke: function () {
            flag = false;
        }
    };
}
function revocable1 (unary) {
    return {
        invoke: function (value) {
            if (unary !== undefined) {
                return unary(value);
            }
        },
        revoke: function () {
            unary = undefined;
        }
    };
}
var rev = revocable(identity),
    invoke = rev.invoke;
// log(invoke(7));
// rev.revoke();
// log(invoke(8));


// Write a function gensymf that makes a function that generates unique symbols.
function gensymf (value) {
    var count = 0;
    return function () {
        count += 1;
        return value + String(count);
    };
}

var geng = gensymf("G"),
    genh = gensymf("H");
// log(geng());
// log(genh());
// log(geng());
// log(genh());


// Write a function gensymff that takes a unary function and a seed and returns a gensymf.
function gensymff (unary, seed) {
    return function (value) {
        return function () {
            seed = unary(seed);
            return value + String(seed);
        }
    }
}
function gensymff2 (unary, seed) {
    return function (prefix) {
        var number = seed;
        return function () {
            number = unary(number);
            return prefix + number;
        }
    }
}
var _gensymf = gensymff(inc, 0),
    geng = _gensymf("G"),
    genh = _gensymf("H");
// log(geng());
// log(genh());
// log(geng());
// log(genh());


// Write a function 'fibonaccif' that returns a function that will return the next fibonacci number.
function fibonaccif (number1, number2) {
    var i = 0;

    return function () {
        var next;
        if(i === 0) {
            next = number1;
        } else if(i === 1) {
            next = number2;
        } else {
            next = number1 + number2;
            number1 = number2;
            number2 = next;
        }
        return next;
    }
}
function fibonaccif2 (a, b) {
    var i = 0;
    return function () {
        var next;
        switch (i) {
            case 0:
                i = 1;
                return a;
            case 1:
                i = 2;
                return b;
            default:
                next = a + b;
                a = b;
                b = next;
                return next;
        }
    }
}
function fibonaccif3 (a, b) {
    return function () {
        var next = a;
        a = b;
        b += next;
        return next;
    }
}
function fibonaccif4 (a, b) {
    return concat(
        element([a, b]),
        function fibonacci () {
            var next = a + b;
            a = b;
            b = next;
            return next;
        });
}
var fib = fibonaccif(0, 1);
// log(fib());
// log(fib());
// log(fib());
// log(fib());


// Write a function m that takes a value and an optional source string and returns them in an object.
function m (value, source) {
    return {
        value: value,
        source: source || String(value)
    };
}
// log(JSON.stringify(m(3)));
// log(JSON.stringify(m(4)));


// Write a function addm that takes two m objects and returns an m object
// JSON.stringify(addm(m(3), m(4))) => {"value":7,"source":"(3+4)"}
function addm (m1, m2) {
    return m(
        m1.value + m2.value,
        "(" + m1.source + "+" + m2.source + ")"
    );
}
// log(JSON.stringify(addm(m(3), m(4))));


// Write a function liftm that takes a binary function and a string and returns a function that acts on m objects.
function liftm (binary, operator) {
    return function (m1, m2) {
        return new m(
            binary(m1.value, m2.value),
            "(" + m1.source + operator 
                + m2.source + ")"
        );
    }
}
var _addm = liftm(add, "+");
// log(JSON.stringify(_addm(m(3), m(4))));


// Modify liftm so that the functions it produces can accept arguments that are either numbers or m objects.
function liftm2 (binary, operator) {
    return function (m1, m2) {
        if(typeof m1 === "number") {
            m1 = new m(m1);
        }
        if(typeof m2 === "number") {
            m2 = new m(m2);
        }
        return new m(
            binary(m1.value, m2.value),
            "(" + m1.source + operator 
                + m2.source + ")"
        );
    }
}
var _addm2 = liftm2(add, "+");
// log(JSON.stringify(_addm2(m(3), m(4))));
// log(JSON.stringify(_addm2(3, 4)));


// Write a function exp that evaluates simple array expressions.
function exp (value) {
    if(Array.isArray(value)) {
        return value[0](value[1], value[2]);
    } else {
        return value;
    }
}
var sae = [mul, 3, 3];
// log(exp(sae));
// log(exp(42));


// Modify exp to evaluate nested array expression
function exp2 (value) {
    return Array.isArray(value)
        ? value[0](exp2(value[1]), exp2(value[2]))
        : value;
}
var nae = [
    Math.sqrt,
    [add, [square, 3], [square, 4]]
];
// log(exp2(nae));


// Write a function addg that adds from many invocations, until it sees an empty invocation
function addg (value) {
    if(value !== undefined) {
        return function (next) {
            if(next === undefined) {
                return value;
            }
            return addg(next + value);
        };
    }
}
// log(addg());              // undefined
// log(addg(2)());           // 2
// log(addg(2)(7)());        // 9
// log(addg(3)(4)(0)());     // 7
// log(addg(1)(2)(4)(8)());  // 15


// Write a function liftg that will take a binary function and apply it to many invocations.
function liftg (binary) {
    return function (value) {
        if(value !== undefined) {
            return function (next) {
                if(next === undefined) {
                    return value;
                }
                return liftg(binary)(binary(next, value));
            };
        }
    };
}
// log(liftg(mul)());
// log(liftg(mul)(3)());
// log(liftg(mul)(3)(4)());
// log(liftg(mul)(3)(4)(0)());
// log(liftg(mul)(1)(2)(4)(8)());


// Write a function arrayg that will build an array from many invocations.
function arrayg (first) {
    var array = [];
    function more (next) {
        if (next === undefined) {
            return array;
        }
        array.push(next);
        return more;
    }
    return more(first);
}
// log(arrayg());
// log(arrayg(3)());
// log(arrayg(3)(4)(5)());


// Write a function that takes a unary function and returns a function that takes an argument
// and a callback
function unaryc (unary) {
    return function (callback, arg) {
        return callback(unary(arg)); // Returning the callback call will provide continuation and next JS will have more optimization around it.
    }
}
sqrtc = unaryc(Math.sqrt);
// sqrtc(log, 81);









