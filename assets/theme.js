function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function () {
  'use strict';
  /**
   * Copyright (c) 2014-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  var runtime = function (exports) {
    var Op = Object.prototype;
    var hasOwn = Op.hasOwnProperty;
    var undefined$1; // More compressible than void 0.

    var $Symbol = typeof Symbol === "function" ? Symbol : {};
    var iteratorSymbol = $Symbol.iterator || "@@iterator";
    var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
    var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

    function define(obj, key, value) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
      return obj[key];
    }

    try {
      // IE 8 has a broken Object.defineProperty that only works on DOM objects.
      define({}, "");
    } catch (err) {
      define = function define(obj, key, value) {
        return obj[key] = value;
      };
    }

    function wrap(innerFn, outerFn, self, tryLocsList) {
      // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
      var generator = Object.create(protoGenerator.prototype);
      var context = new Context(tryLocsList || []); // The ._invoke method unifies the implementations of the .next,
      // .throw, and .return methods.

      generator._invoke = makeInvokeMethod(innerFn, self, context);
      return generator;
    }

    exports.wrap = wrap; // Try/catch helper to minimize deoptimizations. Returns a completion
    // record like context.tryEntries[i].completion. This interface could
    // have been (and was previously) designed to take a closure to be
    // invoked without arguments, but in all the cases we care about we
    // already have an existing method we want to call, so there's no need
    // to create a new function object. We can even get away with assuming
    // the method takes exactly one argument, since that happens to be true
    // in every case, so we don't have to touch the arguments object. The
    // only additional allocation required is the completion record, which
    // has a stable shape and so hopefully should be cheap to allocate.

    function tryCatch(fn, obj, arg) {
      try {
        return {
          type: "normal",
          arg: fn.call(obj, arg)
        };
      } catch (err) {
        return {
          type: "throw",
          arg: err
        };
      }
    }

    var GenStateSuspendedStart = "suspendedStart";
    var GenStateSuspendedYield = "suspendedYield";
    var GenStateExecuting = "executing";
    var GenStateCompleted = "completed"; // Returning this object from the innerFn has the same effect as
    // breaking out of the dispatch switch statement.

    var ContinueSentinel = {}; // Dummy constructor functions that we use as the .constructor and
    // .constructor.prototype properties for functions that return Generator
    // objects. For full spec compliance, you may wish to configure your
    // minifier not to mangle the names of these two functions.

    function Generator() {}

    function GeneratorFunction() {}

    function GeneratorFunctionPrototype() {} // This is a polyfill for %IteratorPrototype% for environments that
    // don't natively support it.


    var IteratorPrototype = {};

    IteratorPrototype[iteratorSymbol] = function () {
      return this;
    };

    var getProto = Object.getPrototypeOf;
    var NativeIteratorPrototype = getProto && getProto(getProto(values([])));

    if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
      // This environment has a native %IteratorPrototype%; use it instead
      // of the polyfill.
      IteratorPrototype = NativeIteratorPrototype;
    }

    var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
    GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
    GeneratorFunctionPrototype.constructor = GeneratorFunction;
    GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"); // Helper for defining the .next, .throw, and .return methods of the
    // Iterator interface in terms of a single ._invoke method.

    function defineIteratorMethods(prototype) {
      ["next", "throw", "return"].forEach(function (method) {
        define(prototype, method, function (arg) {
          return this._invoke(method, arg);
        });
      });
    }

    exports.isGeneratorFunction = function (genFun) {
      var ctor = typeof genFun === "function" && genFun.constructor;
      return ctor ? ctor === GeneratorFunction || // For the native GeneratorFunction constructor, the best we can
      // do is to check its .name property.
      (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
    };

    exports.mark = function (genFun) {
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
      } else {
        genFun.__proto__ = GeneratorFunctionPrototype;
        define(genFun, toStringTagSymbol, "GeneratorFunction");
      }

      genFun.prototype = Object.create(Gp);
      return genFun;
    }; // Within the body of any async function, `await x` is transformed to
    // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
    // `hasOwn.call(value, "__await")` to determine if the yielded value is
    // meant to be awaited.


    exports.awrap = function (arg) {
      return {
        __await: arg
      };
    };

    function AsyncIterator(generator, PromiseImpl) {
      function invoke(method, arg, resolve, reject) {
        var record = tryCatch(generator[method], generator, arg);

        if (record.type === "throw") {
          reject(record.arg);
        } else {
          var result = record.arg;
          var value = result.value;

          if (value && _typeof(value) === "object" && hasOwn.call(value, "__await")) {
            return PromiseImpl.resolve(value.__await).then(function (value) {
              invoke("next", value, resolve, reject);
            }, function (err) {
              invoke("throw", err, resolve, reject);
            });
          }

          return PromiseImpl.resolve(value).then(function (unwrapped) {
            // When a yielded Promise is resolved, its final value becomes
            // the .value of the Promise<{value,done}> result for the
            // current iteration.
            result.value = unwrapped;
            resolve(result);
          }, function (error) {
            // If a rejected Promise was yielded, throw the rejection back
            // into the async generator function so it can be handled there.
            return invoke("throw", error, resolve, reject);
          });
        }
      }

      var previousPromise;

      function enqueue(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new PromiseImpl(function (resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }

        return previousPromise = // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, // Avoid propagating failures to Promises returned by later
        // invocations of the iterator.
        callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      } // Define the unified helper method that is used to implement .next,
      // .throw, and .return (see defineIteratorMethods).


      this._invoke = enqueue;
    }

    defineIteratorMethods(AsyncIterator.prototype);

    AsyncIterator.prototype[asyncIteratorSymbol] = function () {
      return this;
    };

    exports.AsyncIterator = AsyncIterator; // Note that simple async functions are implemented on top of
    // AsyncIterator objects; they just return a Promise for the value of
    // the final result produced by the iterator.

    exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
      if (PromiseImpl === void 0) PromiseImpl = Promise;
      var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
      return exports.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function (result) {
        return result.done ? result.value : iter.next();
      });
    };

    function makeInvokeMethod(innerFn, self, context) {
      var state = GenStateSuspendedStart;
      return function invoke(method, arg) {
        if (state === GenStateExecuting) {
          throw new Error("Generator is already running");
        }

        if (state === GenStateCompleted) {
          if (method === "throw") {
            throw arg;
          } // Be forgiving, per 25.3.3.3.3 of the spec:
          // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume


          return doneResult();
        }

        context.method = method;
        context.arg = arg;

        while (true) {
          var delegate = context.delegate;

          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);

            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }

          if (context.method === "next") {
            // Setting context._sent for legacy support of Babel's
            // function.sent implementation.
            context.sent = context._sent = context.arg;
          } else if (context.method === "throw") {
            if (state === GenStateSuspendedStart) {
              state = GenStateCompleted;
              throw context.arg;
            }

            context.dispatchException(context.arg);
          } else if (context.method === "return") {
            context.abrupt("return", context.arg);
          }

          state = GenStateExecuting;
          var record = tryCatch(innerFn, self, context);

          if (record.type === "normal") {
            // If an exception is thrown from innerFn, we leave state ===
            // GenStateExecuting and loop back for another invocation.
            state = context.done ? GenStateCompleted : GenStateSuspendedYield;

            if (record.arg === ContinueSentinel) {
              continue;
            }

            return {
              value: record.arg,
              done: context.done
            };
          } else if (record.type === "throw") {
            state = GenStateCompleted; // Dispatch the exception by looping back around to the
            // context.dispatchException(context.arg) call above.

            context.method = "throw";
            context.arg = record.arg;
          }
        }
      };
    } // Call delegate.iterator[context.method](context.arg) and handle the
    // result, either by returning a { value, done } result from the
    // delegate iterator, or by modifying context.method and context.arg,
    // setting context.delegate to null, and returning the ContinueSentinel.


    function maybeInvokeDelegate(delegate, context) {
      var method = delegate.iterator[context.method];

      if (method === undefined$1) {
        // A .throw or .return when the delegate iterator has no .throw
        // method always terminates the yield* loop.
        context.delegate = null;

        if (context.method === "throw") {
          // Note: ["return"] must be used for ES3 parsing compatibility.
          if (delegate.iterator["return"]) {
            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            context.method = "return";
            context.arg = undefined$1;
            maybeInvokeDelegate(delegate, context);

            if (context.method === "throw") {
              // If maybeInvokeDelegate(context) changed context.method from
              // "return" to "throw", let that override the TypeError below.
              return ContinueSentinel;
            }
          }

          context.method = "throw";
          context.arg = new TypeError("The iterator does not provide a 'throw' method");
        }

        return ContinueSentinel;
      }

      var record = tryCatch(method, delegate.iterator, context.arg);

      if (record.type === "throw") {
        context.method = "throw";
        context.arg = record.arg;
        context.delegate = null;
        return ContinueSentinel;
      }

      var info = record.arg;

      if (!info) {
        context.method = "throw";
        context.arg = new TypeError("iterator result is not an object");
        context.delegate = null;
        return ContinueSentinel;
      }

      if (info.done) {
        // Assign the result of the finished delegate to the temporary
        // variable specified by delegate.resultName (see delegateYield).
        context[delegate.resultName] = info.value; // Resume execution at the desired location (see delegateYield).

        context.next = delegate.nextLoc; // If context.method was "throw" but the delegate handled the
        // exception, let the outer generator proceed normally. If
        // context.method was "next", forget context.arg since it has been
        // "consumed" by the delegate iterator. If context.method was
        // "return", allow the original .return call to continue in the
        // outer generator.

        if (context.method !== "return") {
          context.method = "next";
          context.arg = undefined$1;
        }
      } else {
        // Re-yield the result returned by the delegate method.
        return info;
      } // The delegate iterator is finished, so forget it and continue with
      // the outer generator.


      context.delegate = null;
      return ContinueSentinel;
    } // Define Generator.prototype.{next,throw,return} in terms of the
    // unified ._invoke helper method.


    defineIteratorMethods(Gp);
    define(Gp, toStringTagSymbol, "Generator"); // A Generator should always return itself as the iterator object when the
    // @@iterator function is called on it. Some browsers' implementations of the
    // iterator prototype chain incorrectly implement this, causing the Generator
    // object to not be returned from this call. This ensures that doesn't happen.
    // See https://github.com/facebook/regenerator/issues/274 for more details.

    Gp[iteratorSymbol] = function () {
      return this;
    };

    Gp.toString = function () {
      return "[object Generator]";
    };

    function pushTryEntry(locs) {
      var entry = {
        tryLoc: locs[0]
      };

      if (1 in locs) {
        entry.catchLoc = locs[1];
      }

      if (2 in locs) {
        entry.finallyLoc = locs[2];
        entry.afterLoc = locs[3];
      }

      this.tryEntries.push(entry);
    }

    function resetTryEntry(entry) {
      var record = entry.completion || {};
      record.type = "normal";
      delete record.arg;
      entry.completion = record;
    }

    function Context(tryLocsList) {
      // The root entry object (effectively a try statement without a catch
      // or a finally block) gives us a place to store values thrown from
      // locations where there is no enclosing try statement.
      this.tryEntries = [{
        tryLoc: "root"
      }];
      tryLocsList.forEach(pushTryEntry, this);
      this.reset(true);
    }

    exports.keys = function (object) {
      var keys = [];

      for (var key in object) {
        keys.push(key);
      }

      keys.reverse(); // Rather than returning an object with a next method, we keep
      // things simple and return the next function itself.

      return function next() {
        while (keys.length) {
          var key = keys.pop();

          if (key in object) {
            next.value = key;
            next.done = false;
            return next;
          }
        } // To avoid creating an additional object, we just hang the .value
        // and .done properties off the next function object itself. This
        // also ensures that the minifier will not anonymize the function.


        next.done = true;
        return next;
      };
    };

    function values(iterable) {
      if (iterable) {
        var iteratorMethod = iterable[iteratorSymbol];

        if (iteratorMethod) {
          return iteratorMethod.call(iterable);
        }

        if (typeof iterable.next === "function") {
          return iterable;
        }

        if (!isNaN(iterable.length)) {
          var i = -1,
              next = function next() {
            while (++i < iterable.length) {
              if (hasOwn.call(iterable, i)) {
                next.value = iterable[i];
                next.done = false;
                return next;
              }
            }

            next.value = undefined$1;
            next.done = true;
            return next;
          };

          return next.next = next;
        }
      } // Return an iterator with no values.


      return {
        next: doneResult
      };
    }

    exports.values = values;

    function doneResult() {
      return {
        value: undefined$1,
        done: true
      };
    }

    Context.prototype = {
      constructor: Context,
      reset: function reset(skipTempReset) {
        this.prev = 0;
        this.next = 0; // Resetting context._sent for legacy support of Babel's
        // function.sent implementation.

        this.sent = this._sent = undefined$1;
        this.done = false;
        this.delegate = null;
        this.method = "next";
        this.arg = undefined$1;
        this.tryEntries.forEach(resetTryEntry);

        if (!skipTempReset) {
          for (var name in this) {
            // Not sure about the optimal order of these conditions:
            if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
              this[name] = undefined$1;
            }
          }
        }
      },
      stop: function stop() {
        this.done = true;
        var rootEntry = this.tryEntries[0];
        var rootRecord = rootEntry.completion;

        if (rootRecord.type === "throw") {
          throw rootRecord.arg;
        }

        return this.rval;
      },
      dispatchException: function dispatchException(exception) {
        if (this.done) {
          throw exception;
        }

        var context = this;

        function handle(loc, caught) {
          record.type = "throw";
          record.arg = exception;
          context.next = loc;

          if (caught) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            context.method = "next";
            context.arg = undefined$1;
          }

          return !!caught;
        }

        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          var record = entry.completion;

          if (entry.tryLoc === "root") {
            // Exception thrown outside of any try block that could handle
            // it, so set the completion value of the entire function to
            // throw the exception.
            return handle("end");
          }

          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, "catchLoc");
            var hasFinally = hasOwn.call(entry, "finallyLoc");

            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              } else if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }
            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              }
            } else if (hasFinally) {
              if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }
            } else {
              throw new Error("try statement without catch or finally");
            }
          }
        }
      },
      abrupt: function abrupt(type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];

          if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
            var finallyEntry = entry;
            break;
          }
        }

        if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
          // Ignore the finally entry if control is not jumping to a
          // location outside the try/catch block.
          finallyEntry = null;
        }

        var record = finallyEntry ? finallyEntry.completion : {};
        record.type = type;
        record.arg = arg;

        if (finallyEntry) {
          this.method = "next";
          this.next = finallyEntry.finallyLoc;
          return ContinueSentinel;
        }

        return this.complete(record);
      },
      complete: function complete(record, afterLoc) {
        if (record.type === "throw") {
          throw record.arg;
        }

        if (record.type === "break" || record.type === "continue") {
          this.next = record.arg;
        } else if (record.type === "return") {
          this.rval = this.arg = record.arg;
          this.method = "return";
          this.next = "end";
        } else if (record.type === "normal" && afterLoc) {
          this.next = afterLoc;
        }

        return ContinueSentinel;
      },
      finish: function finish(finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];

          if (entry.finallyLoc === finallyLoc) {
            this.complete(entry.completion, entry.afterLoc);
            resetTryEntry(entry);
            return ContinueSentinel;
          }
        }
      },
      "catch": function _catch(tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];

          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;

            if (record.type === "throw") {
              var thrown = record.arg;
              resetTryEntry(entry);
            }

            return thrown;
          }
        } // The context.catch method must only be called with a location
        // argument that corresponds to a known catch block.


        throw new Error("illegal catch attempt");
      },
      delegateYield: function delegateYield(iterable, resultName, nextLoc) {
        this.delegate = {
          iterator: values(iterable),
          resultName: resultName,
          nextLoc: nextLoc
        };

        if (this.method === "next") {
          // Deliberately forget the last sent value so that we don't
          // accidentally pass it on to the delegate.
          this.arg = undefined$1;
        }

        return ContinueSentinel;
      }
    }; // Regardless of whether this script is executing as a CommonJS module
    // or not, return the runtime object so that we can declare the variable
    // regeneratorRuntime in the outer scope, which allows this module to be
    // injected easily by `bin/regenerator --include-runtime script.js`.

    return exports;
  }( // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  (typeof module === "undefined" ? "undefined" : _typeof(module)) === "object" ? module.exports : {});

  try {
    regeneratorRuntime = runtime;
  } catch (accidentalStrictMode) {
    // This module should not be running in strict mode, so the above
    // assignment should always work unless something is misconfigured. Just
    // in case runtime.js accidentally runs in strict mode, we can escape
    // strict mode using a global Function call. This could conceivably fail
    // if a Content Security Policy forbids using Function, but in that case
    // the proper solution is to fix the accidental strict mode problem. If
    // you've misconfigured your bundler to force strict mode and applied a
    // CSP to forbid Function, and you're not willing to fix either of those
    // problems, please detail your unique predicament in a GitHub issue.
    Function("r", "regeneratorRuntime = r")(runtime);
  }

  function getDefaultRequestConfig() {
    return JSON.parse(JSON.stringify({
      credentials: 'same-origin',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json;'
      }
    }));
  }

  function fetchJSON(url, config) {
    return fetch(url, config).then(function (response) {
      if (!response.ok) {
        throw response;
      }

      return response.json();
    });
  }

  function cart$1() {
    return fetchJSON('/cart.js', getDefaultRequestConfig());
  }

  function cartAdd(id, quantity, properties) {
    var config = getDefaultRequestConfig();
    config.method = 'POST';
    config.body = JSON.stringify({
      id: id,
      quantity: quantity,
      properties: properties
    });
    return fetchJSON('/cart/add.js', config);
  }

  function cartAddFromForm(formData) {
    var config = getDefaultRequestConfig();
    delete config.headers['Content-Type'];
    config.method = 'POST';
    config.body = formData;
    return fetchJSON('/cart/add.js', config);
  }

  function cartChange(line, options) {
    var config = getDefaultRequestConfig();
    options = options || {};
    config.method = 'POST';
    config.body = JSON.stringify({
      line: line,
      quantity: options.quantity,
      properties: options.properties
    });
    return fetchJSON('/cart/change.js', config);
  }

  function cartClear() {
    var config = getDefaultRequestConfig();
    config.method = 'POST';
    return fetchJSON('/cart/clear.js', config);
  }

  function cartUpdate(body) {
    var config = getDefaultRequestConfig();
    config.method = 'POST';
    config.body = JSON.stringify(body);
    return fetchJSON('/cart/update.js', config);
  }

  function cartShippingRates() {
    return fetchJSON('/cart/shipping_rates.json', getDefaultRequestConfig());
  }

  function key(key) {
    if (typeof key !== 'string' || key.split(':').length !== 2) {
      throw new TypeError('Theme Cart: Provided key value is not a string with the format xxx:xxx');
    }
  }

  function quantity(quantity) {
    if (typeof quantity !== 'number' || isNaN(quantity)) {
      throw new TypeError('Theme Cart: An object which specifies a quantity or properties value is required');
    }
  }

  function id(id) {
    if (typeof id !== 'number' || isNaN(id)) {
      throw new TypeError('Theme Cart: Variant ID must be a number');
    }
  }

  function properties(properties) {
    if (_typeof(properties) !== 'object') {
      throw new TypeError('Theme Cart: Properties must be an object');
    }
  }

  function form(form) {
    if (!(form instanceof HTMLFormElement)) {
      throw new TypeError('Theme Cart: Form must be an instance of HTMLFormElement');
    }
  }

  function options(options) {
    if (_typeof(options) !== 'object') {
      throw new TypeError('Theme Cart: Options must be an object');
    }

    if (typeof options.quantity === 'undefined' && typeof options.properties === 'undefined') {
      throw new Error('Theme Cart: You muse define a value for quantity or properties');
    }

    if (typeof options.quantity !== 'undefined') {
      quantity(options.quantity);
    }

    if (typeof options.properties !== 'undefined') {
      properties(options.properties);
    }
  }
  /**
   * Cart Template Script
   * ------------------------------------------------------------------------------
   * A file that contains scripts highly couple code to the Cart template.
   *
   * @namespace cart
   */

  /**
   * Returns the state object of the cart
   * @returns {Promise} Resolves with the state object of the cart (https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#get-cart)
   */


  function getState() {
    return cart$1();
  }
  /**
   * Returns the index of the cart line item
   * @param {string} key The unique key of the line item
   * @returns {Promise} Resolves with the index number of the line item
   */


  function getItemIndex(key$1) {
    key(key$1);
    return cart$1().then(function (state) {
      var index = -1;
      state.items.forEach(function (item, i) {
        index = item.key === key$1 ? i + 1 : index;
      });

      if (index === -1) {
        return Promise.reject(new Error('Theme Cart: Unable to match line item with provided key'));
      }

      return index;
    });
  }
  /**
   * Fetches the line item object
   * @param {string} key The unique key of the line item
   * @returns {Promise} Resolves with the line item object (See response of cart/add.js https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#add-to-cart)
   */


  function getItem(key$1) {
    key(key$1);
    return cart$1().then(function (state) {
      var lineItem = null;
      state.items.forEach(function (item) {
        lineItem = item.key === key$1 ? item : lineItem;
      });

      if (lineItem === null) {
        return Promise.reject(new Error('Theme Cart: Unable to match line item with provided key'));
      }

      return lineItem;
    });
  }
  /**
   * Add a new line item to the cart
   * @param {number} id The variant's unique ID
   * @param {object} options Optional values to pass to /cart/add.js
   * @param {number} options.quantity The quantity of items to be added to the cart
   * @param {object} options.properties Line item property key/values (https://help.shopify.com/en/themes/liquid/objects/line_item#line_item-properties)
   * @returns {Promise} Resolves with the line item object (See response of cart/add.js https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#add-to-cart)
   */


  function addItem(id$1, options) {
    options = options || {};
    id(id$1);
    return cartAdd(id$1, options.quantity, options.properties);
  }
  /**
   * Add a new line item to the cart from a product form
   * @param {object} form DOM element which is equal to the <form> node
   * @returns {Promise} Resolves with the line item object (See response of cart/add.js https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#add-to-cart)
   */


  function addItemFromForm(form$1) {
    form(form$1);
    var formData = new FormData(form$1);
    id(parseInt(formData.get('id'), 10));
    return cartAddFromForm(formData);
  }
  /**
   * Changes the quantity and/or properties of an existing line item.
   * @param {string} key The unique key of the line item (https://help.shopify.com/en/themes/liquid/objects/line_item#line_item-key)
   * @param {object} options Optional values to pass to /cart/add.js
   * @param {number} options.quantity The quantity of items to be added to the cart
   * @param {object} options.properties Line item property key/values (https://help.shopify.com/en/themes/liquid/objects/line_item#line_item-properties)
   * @returns {Promise} Resolves with the state object of the cart (https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#get-cart)
   */


  function updateItem(key$1, options$1) {
    key(key$1);
    options(options$1);
    return getItemIndex(key$1).then(function (line) {
      return cartChange(line, options$1);
    });
  }
  /**
   * Removes a line item from the cart
   * @param {string} key The unique key of the line item (https://help.shopify.com/en/themes/liquid/objects/line_item#line_item-key)
   * @returns {Promise} Resolves with the state object of the cart (https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#get-cart)
   */


  function removeItem(key$1) {
    key(key$1);
    return getItemIndex(key$1).then(function (line) {
      return cartChange(line, {
        quantity: 0
      });
    });
  }
  /**
   * Sets all quantities of all line items in the cart to zero. This does not remove cart attributes nor the cart note.
   * @returns {Promise} Resolves with the state object of the cart (https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#get-cart)
   */


  function clearItems() {
    return cartClear();
  }
  /**
   * Gets all cart attributes
   * @returns {Promise} Resolves with the cart attributes object
   */


  function getAttributes() {
    return cart$1().then(function (state) {
      return state.attributes;
    });
  }
  /**
   * Sets all cart attributes
   * @returns {Promise} Resolves with the cart state object
   */


  function updateAttributes(attributes) {
    return cartUpdate({
      attributes: attributes
    });
  }
  /**
   * Clears all cart attributes
   * @returns {Promise} Resolves with the cart state object
   */


  function clearAttributes() {
    return getAttributes().then(function (attributes) {
      for (var key in attributes) {
        attributes[key] = '';
      }

      return updateAttributes(attributes);
    });
  }
  /**
   * Gets cart note
   * @returns {Promise} Resolves with the cart note string
   */


  function getNote() {
    return cart$1().then(function (state) {
      return state.note;
    });
  }
  /**
   * Sets cart note
   * @returns {Promise} Resolves with the cart state object
   */


  function updateNote(note) {
    return cartUpdate({
      note: note
    });
  }
  /**
   * Clears cart note
   * @returns {Promise} Resolves with the cart state object
   */


  function clearNote() {
    return cartUpdate({
      note: ''
    });
  }
  /**
   * Get estimated shipping rates.
   * @returns {Promise} Resolves with response of /cart/shipping_rates.json (https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#get-shipping-rates)
   */


  function getShippingRates() {
    return cartShippingRates();
  }

  var cart = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getState: getState,
    getItemIndex: getItemIndex,
    getItem: getItem,
    addItem: addItem,
    addItemFromForm: addItemFromForm,
    updateItem: updateItem,
    removeItem: removeItem,
    clearItems: clearItems,
    getAttributes: getAttributes,
    updateAttributes: updateAttributes,
    clearAttributes: clearAttributes,
    getNote: getNote,
    updateNote: updateNote,
    clearNote: clearNote,
    getShippingRates: getShippingRates
  });
  var runningOnBrowser = typeof window !== "undefined";
  var isBot = runningOnBrowser && !("onscroll" in window) || typeof navigator !== "undefined" && /(gle|ing|ro)bot|crawl|spider/i.test(navigator.userAgent);
  var supportsIntersectionObserver = runningOnBrowser && "IntersectionObserver" in window;
  var supportsClassList = runningOnBrowser && "classList" in document.createElement("p");
  var isHiDpi = runningOnBrowser && window.devicePixelRatio > 1;
  var defaultSettings = {
    elements_selector: ".lazy",
    container: isBot || runningOnBrowser ? document : null,
    threshold: 300,
    thresholds: null,
    data_src: "src",
    data_srcset: "srcset",
    data_sizes: "sizes",
    data_bg: "bg",
    data_bg_hidpi: "bg-hidpi",
    data_bg_multi: "bg-multi",
    data_bg_multi_hidpi: "bg-multi-hidpi",
    data_poster: "poster",
    class_applied: "applied",
    class_loading: "loading",
    class_loaded: "loaded",
    class_error: "error",
    class_entered: "entered",
    class_exited: "exited",
    unobserve_completed: true,
    unobserve_entered: false,
    cancel_on_exit: true,
    callback_enter: null,
    callback_exit: null,
    callback_applied: null,
    callback_loading: null,
    callback_loaded: null,
    callback_error: null,
    callback_finish: null,
    callback_cancel: null,
    use_native: false
  };

  var getExtendedSettings = function getExtendedSettings(customSettings) {
    return Object.assign({}, defaultSettings, customSettings);
  };
  /* Creates instance and notifies it through the window element */


  var createInstance = function createInstance(classObj, options) {
    var event;
    var eventString = "LazyLoad::Initialized";
    var instance = new classObj(options);

    try {
      // Works in modern browsers
      event = new CustomEvent(eventString, {
        detail: {
          instance: instance
        }
      });
    } catch (err) {
      // Works in Internet Explorer (all versions)
      event = document.createEvent("CustomEvent");
      event.initCustomEvent(eventString, false, false, {
        instance: instance
      });
    }

    window.dispatchEvent(event);
  };
  /* Auto initialization of one or more instances of lazyload, depending on the 
      options passed in (plain object or an array) */


  var autoInitialize = function autoInitialize(classObj, options) {
    if (!options) {
      return;
    }

    if (!options.length) {
      // Plain object
      createInstance(classObj, options);
    } else {
      // Array of objects
      for (var i = 0, optionsItem; optionsItem = options[i]; i += 1) {
        createInstance(classObj, optionsItem);
      }
    }
  };

  var statusLoading = "loading";
  var statusLoaded = "loaded";
  var statusApplied = "applied";
  var statusEntered = "entered";
  var statusError = "error";
  var statusNative = "native";
  var dataPrefix = "data-";
  var statusDataName = "ll-status";

  var getData = function getData(element, attribute) {
    return element.getAttribute(dataPrefix + attribute);
  };

  var setData = function setData(element, attribute, value) {
    var attrName = dataPrefix + attribute;

    if (value === null) {
      element.removeAttribute(attrName);
      return;
    }

    element.setAttribute(attrName, value);
  };

  var getStatus = function getStatus(element) {
    return getData(element, statusDataName);
  };

  var setStatus = function setStatus(element, status) {
    return setData(element, statusDataName, status);
  };

  var resetStatus = function resetStatus(element) {
    return setStatus(element, null);
  };

  var hasEmptyStatus = function hasEmptyStatus(element) {
    return getStatus(element) === null;
  };

  var hasStatusLoading = function hasStatusLoading(element) {
    return getStatus(element) === statusLoading;
  };

  var hasStatusError = function hasStatusError(element) {
    return getStatus(element) === statusError;
  };

  var hasStatusNative = function hasStatusNative(element) {
    return getStatus(element) === statusNative;
  };

  var statusesAfterLoading = [statusLoading, statusLoaded, statusApplied, statusError];

  var hadStartedLoading = function hadStartedLoading(element) {
    return statusesAfterLoading.indexOf(getStatus(element)) >= 0;
  };

  var safeCallback = function safeCallback(callback, arg1, arg2, arg3) {
    if (!callback) {
      return;
    }

    if (arg3 !== undefined) {
      callback(arg1, arg2, arg3);
      return;
    }

    if (arg2 !== undefined) {
      callback(arg1, arg2);
      return;
    }

    callback(arg1);
  };

  var addClass = function addClass(element, className) {
    if (supportsClassList) {
      element.classList.add(className);
      return;
    }

    element.className += (element.className ? " " : "") + className;
  };

  var removeClass = function removeClass(element, className) {
    if (supportsClassList) {
      element.classList.remove(className);
      return;
    }

    element.className = element.className.replace(new RegExp("(^|\\s+)" + className + "(\\s+|$)"), " ").replace(/^\s+/, "").replace(/\s+$/, "");
  };

  var addTempImage = function addTempImage(element) {
    element.llTempImage = document.createElement("IMG");
  };

  var deleteTempImage = function deleteTempImage(element) {
    delete element.llTempImage;
  };

  var getTempImage = function getTempImage(element) {
    return element.llTempImage;
  };

  var unobserve = function unobserve(element, instance) {
    if (!instance) return;
    var observer = instance._observer;
    if (!observer) return;
    observer.unobserve(element);
  };

  var resetObserver = function resetObserver(observer) {
    observer.disconnect();
  };

  var unobserveEntered = function unobserveEntered(element, settings, instance) {
    if (settings.unobserve_entered) unobserve(element, instance);
  };

  var updateLoadingCount = function updateLoadingCount(instance, delta) {
    if (!instance) return;
    instance.loadingCount += delta;
  };

  var decreaseToLoadCount = function decreaseToLoadCount(instance) {
    if (!instance) return;
    instance.toLoadCount -= 1;
  };

  var setToLoadCount = function setToLoadCount(instance, value) {
    if (!instance) return;
    instance.toLoadCount = value;
  };

  var isSomethingLoading = function isSomethingLoading(instance) {
    return instance.loadingCount > 0;
  };

  var haveElementsToLoad = function haveElementsToLoad(instance) {
    return instance.toLoadCount > 0;
  };

  var getSourceTags = function getSourceTags(parentTag) {
    var sourceTags = [];

    for (var i = 0, childTag; childTag = parentTag.children[i]; i += 1) {
      if (childTag.tagName === "SOURCE") {
        sourceTags.push(childTag);
      }
    }

    return sourceTags;
  };

  var setAttributeIfValue = function setAttributeIfValue(element, attrName, value) {
    if (!value) {
      return;
    }

    element.setAttribute(attrName, value);
  };

  var resetAttribute = function resetAttribute(element, attrName) {
    element.removeAttribute(attrName);
  };

  var hasOriginalAttributes = function hasOriginalAttributes(element) {
    return !!element.llOriginalAttrs;
  };

  var saveOriginalImageAttributes = function saveOriginalImageAttributes(element) {
    if (hasOriginalAttributes(element)) {
      return;
    }

    var originalAttributes = {};
    originalAttributes["src"] = element.getAttribute("src");
    originalAttributes["srcset"] = element.getAttribute("srcset");
    originalAttributes["sizes"] = element.getAttribute("sizes");
    element.llOriginalAttrs = originalAttributes;
  };

  var restoreOriginalImageAttributes = function restoreOriginalImageAttributes(element) {
    if (!hasOriginalAttributes(element)) {
      return;
    }

    var originalAttributes = element.llOriginalAttrs;
    setAttributeIfValue(element, "src", originalAttributes["src"]);
    setAttributeIfValue(element, "srcset", originalAttributes["srcset"]);
    setAttributeIfValue(element, "sizes", originalAttributes["sizes"]);
  };

  var setImageAttributes = function setImageAttributes(element, settings) {
    setAttributeIfValue(element, "sizes", getData(element, settings.data_sizes));
    setAttributeIfValue(element, "srcset", getData(element, settings.data_srcset));
    setAttributeIfValue(element, "src", getData(element, settings.data_src));
  };

  var resetImageAttributes = function resetImageAttributes(element) {
    resetAttribute(element, "src");
    resetAttribute(element, "srcset");
    resetAttribute(element, "sizes");
  };

  var forEachPictureSource = function forEachPictureSource(element, fn) {
    var parent = element.parentNode;

    if (!parent || parent.tagName !== "PICTURE") {
      return;
    }

    var sourceTags = getSourceTags(parent);
    sourceTags.forEach(fn);
  };

  var forEachVideoSource = function forEachVideoSource(element, fn) {
    var sourceTags = getSourceTags(element);
    sourceTags.forEach(fn);
  };

  var restoreOriginalAttributesImg = function restoreOriginalAttributesImg(element) {
    forEachPictureSource(element, function (sourceTag) {
      restoreOriginalImageAttributes(sourceTag);
    });
    restoreOriginalImageAttributes(element);
  };

  var setSourcesImg = function setSourcesImg(element, settings) {
    forEachPictureSource(element, function (sourceTag) {
      saveOriginalImageAttributes(sourceTag);
      setImageAttributes(sourceTag, settings);
    });
    saveOriginalImageAttributes(element);
    setImageAttributes(element, settings);
  };

  var resetSourcesImg = function resetSourcesImg(element) {
    forEachPictureSource(element, function (sourceTag) {
      resetImageAttributes(sourceTag);
    });
    resetImageAttributes(element);
  };

  var setSourcesIframe = function setSourcesIframe(element, settings) {
    setAttributeIfValue(element, "src", getData(element, settings.data_src));
  };

  var setSourcesVideo = function setSourcesVideo(element, settings) {
    forEachVideoSource(element, function (sourceTag) {
      setAttributeIfValue(sourceTag, "src", getData(sourceTag, settings.data_src));
    });
    setAttributeIfValue(element, "poster", getData(element, settings.data_poster));
    setAttributeIfValue(element, "src", getData(element, settings.data_src));
    element.load();
  };

  var setSourcesFunctions = {
    IMG: setSourcesImg,
    IFRAME: setSourcesIframe,
    VIDEO: setSourcesVideo
  };

  var setBackground = function setBackground(element, settings, instance) {
    var bg1xValue = getData(element, settings.data_bg);
    var bgHiDpiValue = getData(element, settings.data_bg_hidpi);
    var bgDataValue = isHiDpi && bgHiDpiValue ? bgHiDpiValue : bg1xValue;
    if (!bgDataValue) return;
    element.style.backgroundImage = "url(\"".concat(bgDataValue, "\")");
    getTempImage(element).setAttribute("src", bgDataValue);
    manageLoading(element, settings, instance);
  }; // NOTE: THE TEMP IMAGE TRICK CANNOT BE DONE WITH data-multi-bg
  // BECAUSE INSIDE ITS VALUES MUST BE WRAPPED WITH URL() AND ONE OF THEM
  // COULD BE A GRADIENT BACKGROUND IMAGE


  var setMultiBackground = function setMultiBackground(element, settings, instance) {
    var bg1xValue = getData(element, settings.data_bg_multi);
    var bgHiDpiValue = getData(element, settings.data_bg_multi_hidpi);
    var bgDataValue = isHiDpi && bgHiDpiValue ? bgHiDpiValue : bg1xValue;

    if (!bgDataValue) {
      return;
    }

    element.style.backgroundImage = bgDataValue;
    manageApplied(element, settings, instance);
  };

  var setSources = function setSources(element, settings) {
    var setSourcesFunction = setSourcesFunctions[element.tagName];

    if (!setSourcesFunction) {
      return;
    }

    setSourcesFunction(element, settings);
  };

  var manageApplied = function manageApplied(element, settings, instance) {
    addClass(element, settings.class_applied);
    setStatus(element, statusApplied);

    if (settings.unobserve_completed) {
      // Unobserve now because we can't do it on load
      unobserve(element, settings);
    }

    safeCallback(settings.callback_applied, element, instance);
  };

  var manageLoading = function manageLoading(element, settings, instance) {
    updateLoadingCount(instance, +1);
    addClass(element, settings.class_loading);
    setStatus(element, statusLoading);
    safeCallback(settings.callback_loading, element, instance);
  };

  var elementsWithLoadEvent = ["IMG", "IFRAME", "VIDEO"];

  var hasLoadEvent = function hasLoadEvent(element) {
    return elementsWithLoadEvent.indexOf(element.tagName) > -1;
  };

  var checkFinish = function checkFinish(settings, instance) {
    if (instance && !isSomethingLoading(instance) && !haveElementsToLoad(instance)) {
      safeCallback(settings.callback_finish, instance);
    }
  };

  var addEventListener = function addEventListener(element, eventName, handler) {
    element.addEventListener(eventName, handler);
    element.llEvLisnrs[eventName] = handler;
  };

  var removeEventListener = function removeEventListener(element, eventName, handler) {
    element.removeEventListener(eventName, handler);
  };

  var hasEventListeners = function hasEventListeners(element) {
    return !!element.llEvLisnrs;
  };

  var addEventListeners = function addEventListeners(element, loadHandler, errorHandler) {
    if (!hasEventListeners(element)) element.llEvLisnrs = {};
    var loadEventName = element.tagName === "VIDEO" ? "loadeddata" : "load";
    addEventListener(element, loadEventName, loadHandler);
    addEventListener(element, "error", errorHandler);
  };

  var removeEventListeners = function removeEventListeners(element) {
    if (!hasEventListeners(element)) {
      return;
    }

    var eventListeners = element.llEvLisnrs;

    for (var eventName in eventListeners) {
      var handler = eventListeners[eventName];
      removeEventListener(element, eventName, handler);
    }

    delete element.llEvLisnrs;
  };

  var doneHandler = function doneHandler(element, settings, instance) {
    deleteTempImage(element);
    updateLoadingCount(instance, -1);
    decreaseToLoadCount(instance);
    removeClass(element, settings.class_loading);

    if (settings.unobserve_completed) {
      unobserve(element, instance);
    }
  };

  var loadHandler = function loadHandler(event, element, settings, instance) {
    var goingNative = hasStatusNative(element);
    doneHandler(element, settings, instance);
    addClass(element, settings.class_loaded);
    setStatus(element, statusLoaded);
    safeCallback(settings.callback_loaded, element, instance);
    if (!goingNative) checkFinish(settings, instance);
  };

  var errorHandler = function errorHandler(event, element, settings, instance) {
    var goingNative = hasStatusNative(element);
    doneHandler(element, settings, instance);
    addClass(element, settings.class_error);
    setStatus(element, statusError);
    safeCallback(settings.callback_error, element, instance);
    if (!goingNative) checkFinish(settings, instance);
  };

  var addOneShotEventListeners = function addOneShotEventListeners(element, settings, instance) {
    var elementToListenTo = getTempImage(element) || element;

    if (hasEventListeners(elementToListenTo)) {
      // This happens when loading is retried twice
      return;
    }

    var _loadHandler = function _loadHandler(event) {
      loadHandler(event, element, settings, instance);
      removeEventListeners(elementToListenTo);
    };

    var _errorHandler = function _errorHandler(event) {
      errorHandler(event, element, settings, instance);
      removeEventListeners(elementToListenTo);
    };

    addEventListeners(elementToListenTo, _loadHandler, _errorHandler);
  };

  var loadBackground = function loadBackground(element, settings, instance) {
    addTempImage(element);
    addOneShotEventListeners(element, settings, instance);
    setBackground(element, settings, instance);
    setMultiBackground(element, settings, instance);
  };

  var loadRegular = function loadRegular(element, settings, instance) {
    addOneShotEventListeners(element, settings, instance);
    setSources(element, settings);
    manageLoading(element, settings, instance);
  };

  var load = function load(element, settings, instance) {
    if (hasLoadEvent(element)) {
      loadRegular(element, settings, instance);
    } else {
      loadBackground(element, settings, instance);
    }
  };

  var loadNative = function loadNative(element, settings, instance) {
    element.setAttribute("loading", "lazy");
    addOneShotEventListeners(element, settings, instance);
    setSources(element, settings);
    setStatus(element, statusNative);
  };

  var cancelLoading = function cancelLoading(element, entry, settings, instance) {
    if (!settings.cancel_on_exit) return;
    if (!hasStatusLoading(element)) return;
    if (element.tagName !== "IMG") return; //Works only on images

    removeEventListeners(element);
    resetSourcesImg(element);
    restoreOriginalAttributesImg(element);
    removeClass(element, settings.class_loading);
    updateLoadingCount(instance, -1);
    resetStatus(element);
    safeCallback(settings.callback_cancel, element, entry, instance);
  };

  var onEnter = function onEnter(element, entry, settings, instance) {
    var dontLoad = hadStartedLoading(element);
    /* Save status 
    before setting it, to prevent loading it again. Fixes #526. */

    setStatus(element, statusEntered);
    addClass(element, settings.class_entered);
    removeClass(element, settings.class_exited);
    unobserveEntered(element, settings, instance);
    safeCallback(settings.callback_enter, element, entry, instance);
    if (dontLoad) return;
    load(element, settings, instance);
  };

  var onExit = function onExit(element, entry, settings, instance) {
    if (hasEmptyStatus(element)) return; //Ignore the first pass, at landing

    addClass(element, settings.class_exited);
    cancelLoading(element, entry, settings, instance);
    safeCallback(settings.callback_exit, element, entry, instance);
  };

  var tagsWithNativeLazy = ["IMG", "IFRAME", "VIDEO"];

  var shouldUseNative = function shouldUseNative(settings) {
    return settings.use_native && "loading" in HTMLImageElement.prototype;
  };

  var loadAllNative = function loadAllNative(elements, settings, instance) {
    elements.forEach(function (element) {
      if (tagsWithNativeLazy.indexOf(element.tagName) === -1) {
        return;
      }

      loadNative(element, settings, instance);
    });
    setToLoadCount(instance, 0);
  };

  var isIntersecting = function isIntersecting(entry) {
    return entry.isIntersecting || entry.intersectionRatio > 0;
  };

  var getObserverSettings = function getObserverSettings(settings) {
    return {
      root: settings.container === document ? null : settings.container,
      rootMargin: settings.thresholds || settings.threshold + "px"
    };
  };

  var intersectionHandler = function intersectionHandler(entries, settings, instance) {
    entries.forEach(function (entry) {
      return isIntersecting(entry) ? onEnter(entry.target, entry, settings, instance) : onExit(entry.target, entry, settings, instance);
    });
  };

  var observeElements = function observeElements(observer, elements) {
    elements.forEach(function (element) {
      observer.observe(element);
    });
  };

  var updateObserver = function updateObserver(observer, elementsToObserve) {
    resetObserver(observer);
    observeElements(observer, elementsToObserve);
  };

  var setObserver = function setObserver(settings, instance) {
    if (!supportsIntersectionObserver || shouldUseNative(settings)) {
      return;
    }

    instance._observer = new IntersectionObserver(function (entries) {
      intersectionHandler(entries, settings, instance);
    }, getObserverSettings(settings));
  };

  var toArray = function toArray(nodeSet) {
    return Array.prototype.slice.call(nodeSet);
  };

  var queryElements = function queryElements(settings) {
    return settings.container.querySelectorAll(settings.elements_selector);
  };

  var excludeManagedElements = function excludeManagedElements(elements) {
    return toArray(elements).filter(hasEmptyStatus);
  };

  var hasError = function hasError(element) {
    return hasStatusError(element);
  };

  var filterErrorElements = function filterErrorElements(elements) {
    return toArray(elements).filter(hasError);
  };

  var getElementsToLoad = function getElementsToLoad(elements, settings) {
    return excludeManagedElements(elements || queryElements(settings));
  };

  var retryLazyLoad = function retryLazyLoad(settings, instance) {
    var errorElements = filterErrorElements(queryElements(settings));
    errorElements.forEach(function (element) {
      removeClass(element, settings.class_error);
      resetStatus(element);
    });
    instance.update();
  };

  var setOnlineCheck = function setOnlineCheck(settings, instance) {
    if (!runningOnBrowser) {
      return;
    }

    window.addEventListener("online", function () {
      retryLazyLoad(settings, instance);
    });
  };

  var LazyLoad = function LazyLoad(customSettings, elements) {
    var settings = getExtendedSettings(customSettings);
    this._settings = settings;
    this.loadingCount = 0;
    setObserver(settings, this);
    setOnlineCheck(settings, this);
    this.update(elements);
  };

  LazyLoad.prototype = {
    update: function update(givenNodeset) {
      var settings = this._settings;
      var elementsToLoad = getElementsToLoad(givenNodeset, settings);
      setToLoadCount(this, elementsToLoad.length);

      if (isBot || !supportsIntersectionObserver) {
        this.loadAll(elementsToLoad);
        return;
      }

      if (shouldUseNative(settings)) {
        loadAllNative(elementsToLoad, settings, this);
        return;
      }

      updateObserver(this._observer, elementsToLoad);
    },
    destroy: function destroy() {
      // Observer
      if (this._observer) {
        this._observer.disconnect();
      } // Clean custom attributes on elements


      queryElements(this._settings).forEach(function (element) {
        delete element.llOriginalAttrs;
      }); // Delete all internal props

      delete this._observer;
      delete this._settings;
      delete this.loadingCount;
      delete this.toLoadCount;
    },
    loadAll: function loadAll(elements) {
      var _this = this;

      var settings = this._settings;
      var elementsToLoad = getElementsToLoad(elements, settings);
      elementsToLoad.forEach(function (element) {
        unobserve(element, _this);
        load(element, settings, _this);
      });
    }
  };

  LazyLoad.load = function (element, customSettings) {
    var settings = getExtendedSettings(customSettings);
    load(element, settings);
  };

  LazyLoad.resetStatus = function (element) {
    resetStatus(element);
  }; // Automatic instances creation if required (useful for async script loading)


  if (runningOnBrowser) {
    autoInitialize(LazyLoad, window.lazyLoadOptions);
  }

  var init$1 = function init$1() {
    new LazyLoad(); // console.log(lazyInstance);
  };

  window.Currency = window.Currency || {};

  var Currency = function () {
    var formatString;

    function formatMoney(cents, format) {
      if (typeof cents === 'string') {
        cents = cents.replace('.', '');
      }

      var value = '';
      var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;

      if (langify.locale.iso_code === "en") {
        formatString = format || '{{amount}} AED';
      } else {
        formatString = format || 'د.إ {{amount}}';
      }

      function formatWithDelimiters(number, precision, thousands, decimal) {
        thousands = thousands || ',';
        decimal = decimal || '.';

        if (isNaN(number) || number === null) {
          return 0;
        }

        number = (number / 100.0).toFixed(precision);
        var parts = number.split('.');
        var dollarsAmount = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands);
        var centsAmount = parts[1] ? decimal + parts[1] : '';
        return dollarsAmount + centsAmount;
      }

      switch (formatString.match(placeholderRegex)[1]) {
        case 'amount':
          value = formatWithDelimiters(cents, 2);
          break;

        case 'amount_no_decimals':
          value = formatWithDelimiters(cents, 0);
          break;

        case 'amount_with_comma_separator':
          value = formatWithDelimiters(cents, 2, '.', ',');
          break;

        case 'amount_no_decimals_with_comma_separator':
          value = formatWithDelimiters(cents, 0, '.', ',');
          break;

        case 'amount_no_decimals_with_space_separator':
          value = formatWithDelimiters(cents, 0, ' ');
          break;

        case 'amount_with_apostrophe_separator':
          value = formatWithDelimiters(cents, 2, "'");
          break;
      }

      var valueNumber = value ? value.substring(0, value.length - 3) : null;
      return formatString.replace(placeholderRegex, valueNumber);
    }

    return {
      formatMoney: formatMoney
    };
  }();

  window.Currency = Currency;

  var MediaGallery = function () {
    var parentEl = document.querySelector(".pdp__media");

    function renderVideoSources(slide) {
      if (!slide) return;
      return slide.sources.map(function (source) {
        return "<source src=\"".concat(source.url, "\" type=\"").concat(source.mime_type, "\"/>");
      }).join("");
    }

    function renderSlide(slide) {
      if (slide.media_type === "image") {
        var slideHTML = "\n                <div class=\"pdp__media__master__slide\">\n                    <img src=\"".concat(slide === null || slide === void 0 ? void 0 : slide.src, "\" alt=\"").concat(slide === null || slide === void 0 ? void 0 : slide.alt, "\" class=\"pdp__media__master__slide__img\">\n                </div>\n            ");
        document.querySelector(".pdp__media__master__slider").insertAdjacentHTML("beforeend", slideHTML);
      }

      if (slide.media_type === "video") {
        var _slideHTML = "\n                <div class=\"pdp__media__master__slide\">\n                    <div class=\"pdp__media__master__slide__video-playbox\">\n                    <img src=\"https://cdn.shopify.com/s/files/1/0575/8517/2679/files/playbutton2.png?v=1627570945\" alt=\"\" class=\"pdp__media__master__slide__video-playbox__img\">\n                    </div>\n                    <video width=\"100%\" muted controls preload=\"metadata\">".concat(renderVideoSources(slide), "</video>\n                </div>\n            ");

        document.querySelector(".pdp__media__master__slider").insertAdjacentHTML("beforeend", _slideHTML);
      }
    }

    function renderThumb(slide) {
      if (slide.media_type === "image") {
        var slideHTML = "\n                <div class=\"pdp__media__thumbs__slide\">\n                    <img src=\"".concat(slide === null || slide === void 0 ? void 0 : slide.src, "\" alt=\"\" class=\"pdp__media__master__slide__img\">\n                </div>\n            ");
        document.querySelector(".pdp__media__thumbs__slider").insertAdjacentHTML("beforeend", slideHTML);
      }

      if (slide.media_type === "video") {
        var _slide$preview_image, _slide$preview_image2;

        var _slideHTML2 = "\n                <div class=\"pdp__media__thumbs__slide\">\n                    <div class=\"pdp__media__thumbs__slide__video-playbox\">\n                        <img src=\"https://cdn.shopify.com/s/files/1/0575/8517/2679/files/playbutton2.png?v=1627570945\" alt=\"\" class=\"pdp__media__thumbs__slide__video-playbox__img\">\n                    </div>\n                    <img src=\"".concat(slide === null || slide === void 0 ? void 0 : (_slide$preview_image = slide.preview_image) === null || _slide$preview_image === void 0 ? void 0 : _slide$preview_image.src, "\" alt=\"").concat(slide === null || slide === void 0 ? void 0 : (_slide$preview_image2 = slide.preview_image) === null || _slide$preview_image2 === void 0 ? void 0 : _slide$preview_image2.alt, "\" class=\"pdp__media__master__slide__img\">\n                </div>\n            ");

        document.querySelector(".pdp__media__thumbs__slider").insertAdjacentHTML("beforeend", _slideHTML2);
      }
    }

    function renderMasterSlides(images) {
      document.querySelector(".pdp__media__master__slider").innerHTML = "";
      images.forEach(function (slide) {
        return renderSlide(slide);
      });
    }

    function renderThumbSlides(images) {
      document.querySelector(".pdp__media__thumbs__slider").innerHTML = "";
      images.forEach(function (slide) {
        return renderThumb(slide);
      });
    }

    function initSlides() {
      $(".pdp__media__master__slider").slick({
        dots: false,
        arrows: true,
        fade: true,
        lazyload: 'anticipated',
        prevArrow: $(".pdp__media__master__slider__arrow.pdp__media__master__slider__arrow-prev"),
        nextArrow: $(".pdp__media__master__slider__arrow.pdp__media__master__slider__arrow-next")
      });
      $(".pdp__media__thumbs__slider").slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        dots: false,
        arrows: false,
        asNavFor: ".pdp__media__master__slider",
        focusOnSelect: true
      });
    }

    function addListeners() {
      if (!parentEl) return;
      var videos = parentEl.querySelectorAll("video");
      if (!videos) return;
      videos.forEach(function (v) {
        v.addEventListener("play", function (event) {
          event.target.closest(".pdp__media__master__slide").querySelector(".pdp__media__master__slide__video-playbox").style.display = "none";
        });
        v.addEventListener("pause", function (event) {
          event.target.closest(".pdp__media__master__slide").querySelector(".pdp__media__master__slide__video-playbox").style.display = "block";
        });
      });
    }

    function showSlides() {
      document.querySelector(".pdp__media__shimmer").style.display = "none";
      document.querySelector(".pdp__media__master").style.opacity = 1;
      document.querySelector(".pdp__media__master").style.visibility = "visible";
      document.querySelector(".pdp__media__thumbs").style.opacity = 1;
      document.querySelector(".pdp__media__thumbs").style.visibility = "visible";
    }

    return {
      init: function init() {
        if (objectData.product) {
          if (objectData.hasOnlyDefaultVariant) {
            initSlides();
            setTimeout(function () {
              showSlides();
            }, 300);
          } else {
            var _objectData, _objectData$product, _objectData2, _objectData2$selected, _objectData2$selected2;

            var countPlus = function countPlus() {
              counter = counter + 1;

              if (counter === allImgsLength) {
                // console.log("All Images loaded!")
                initSlides();
                showSlides();
              }
            };

            var medias = (_objectData = objectData) === null || _objectData === void 0 ? void 0 : (_objectData$product = _objectData.product) === null || _objectData$product === void 0 ? void 0 : _objectData$product.media;
            (_objectData2 = objectData) === null || _objectData2 === void 0 ? void 0 : (_objectData2$selected = _objectData2.selectedVaraint) === null || _objectData2$selected === void 0 ? void 0 : (_objectData2$selected2 = _objectData2$selected.featured_image) === null || _objectData2$selected2 === void 0 ? void 0 : _objectData2$selected2.alt;
            var currentVariantImages = medias === null || medias === void 0 ? void 0 : medias.filter(function (media) {
              if (media.alt === null) {
                return medias;
              } else {
                return media.alt;
              }
            });
            renderMasterSlides(currentVariantImages);
            renderThumbSlides(currentVariantImages);
            var allImgs = document.querySelectorAll(".pdp__media__master__slide__img");
            var allImgsLength = allImgs.length;
            var counter = 0;
            [].forEach.call(allImgs, function (img) {
              if (img.complete) {
                countPlus();
              } else {
                img.addEventListener("load", countPlus, false);
              }
            });
          }
        }

        addListeners();
      }
    };
  }();

  window.MediaGallery = MediaGallery;

  var PDPListeners = function () {
    // Selectors
    var selectors = {
      headerCartBubble: ".mcart-count",
      addToCartButtonLoading: ".pdp__content__control__add-to-cart-btn__loading",
      addToCartButtonLabel: ".pdp__content__control__add-to-cart-btn__label",
      qtyElem: ".pdp__content__control__qty__value",
      accordionItem: ".pdp__content__accordions__item",
      accordionBody: ".pdp__content__accordions__item__body",
      accordionHeading: ".pdp__content__accordions__item__heading",
      accordionArrow: ".pdp__content__list__heading__arrow",
      miniCartContainer: ".mini-cart-list",
      miniCartItem: ".single-mcart-item"
    }; // Update the variant

    function resetCount() {
      if (document.querySelector(selectors.qtyElem)) {
        document.querySelector(selectors.qtyElem).innerHTML = 1;
      }
    } //Update the header cart count.


    function updateBubble(quantity) {
      var currentCount = null;

      if (document.querySelector(selectors.headerCartBubble)) {
        currentCount = parseInt(document.querySelector(selectors.headerCartBubble).innerHTML); // console.log("current count " + currentCount)

        if (quantity) {
          var newCount = currentCount + quantity;
          document.querySelector(selectors.headerCartBubble).innerHTML = newCount;
        } else {
          document.querySelector(selectors.headerCartBubble).innerHTML = currentCount;
        }
      }
    } // Show error message


    function showError(message) {
      var errorBox = document.querySelector('.pdp__content__error');
      var errorText = document.querySelector('.pdp__content__error__text');
      errorText.innerHTML = message || "There was an error adding product to the cart.";
      errorBox.style.display = "flex";
    } // Hide error message 


    function hideError() {
      var errorBox = document.querySelector('.pdp__content__error');
      errorBox.style.display = "none";
    } // Show Add to cart button laoder 


    function showLoaderAddToCartButton() {
      if (document.querySelector(selectors.addToCartButtonLabel)) {
        document.querySelector(selectors.addToCartButtonLabel).style.display = "none";
      }

      if (document.querySelector(selectors.addToCartButtonLoading)) {
        document.querySelector(selectors.addToCartButtonLoading).style.display = "block";
      }
    } // Hide loader in add to cart button.


    function hideLoaderAddToCartButton() {
      if (document.querySelector(selectors.addToCartButtonLabel)) {
        document.querySelector(selectors.addToCartButtonLabel).style.display = "block";
      }

      if (document.querySelector(selectors.addToCartButtonLoading)) {
        document.querySelector(selectors.addToCartButtonLoading).style.display = "none";
      }
    } // Open Added to cart modal.


    function openAddedtoCartModal(title, image, quantity, price, compare_price, size) {
      if (title && document.querySelector('.pdpmodal-addedtocart__modal__body__content__title')) {
        document.querySelector('.pdpmodal-addedtocart__modal__body__content__title').innerHTML = title;
      }

      if (image && document.querySelector('.pdpmodal-addedtocart__modal__body__media__img')) {
        document.querySelector('.pdpmodal-addedtocart__modal__body__media__img').src = image;
      }

      if (quantity && document.querySelector('.pdpmodal-addedtocart__modal__body__content__qty__value')) {
        document.querySelector('.pdpmodal-addedtocart__modal__body__content__qty__value').innerHTML = quantity;
      }

      if (price && document.querySelector('.pdpmodal-addedtocart__modal__body__content__price__original')) {
        document.querySelector('.pdpmodal-addedtocart__modal__body__content__price__original').innerHTML = price;
      }

      if (compare_price && compare_price > price) {
        if (document.querySelector('.pdpmodal-addedtocart__modal__body__content__price__compare')) {
          document.querySelector('.pdpmodal-addedtocart__modal__body__content__price__compare').innerHTML = compare_price;
        }
      } else {
        if (document.querySelector('.pdpmodal-addedtocart__modal__body__content__price__compare')) {
          document.querySelector('.pdpmodal-addedtocart__modal__body__content__price__compare').innerHTML = "";
        }
      }

      if (size && document.querySelector('.pdpmodal-addedtocart__modal__body__content__size__value')) {
        document.querySelector('.pdpmodal-addedtocart__modal__body__content__size__value').innerHTML = size;
        document.querySelector('.pdpmodal-addedtocart__modal__body__content__size').style.display = "flex";
      }

      document.querySelector('.pdpmodal-addedtocart__overlay').style.display = "block";
      document.querySelector('.pdpmodal-addedtocart__modal').style.display = "block";
    }

    function renderItemtoMinicart(_x, _x2) {
      return _renderItemtoMinicart.apply(this, arguments);
    }

    function _renderItemtoMinicart() {
      _renderItemtoMinicart = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(variant, comparePrice) {
        var compare_variant_unit_price, varinatComparePrice, _variant$featured_ima, _variant$featured_ima2, minicartItemHTML;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return getVariantComparePrice(variant === null || variant === void 0 ? void 0 : variant.handle, variant === null || variant === void 0 ? void 0 : variant.variant_id);

              case 2:
                compare_variant_unit_price = _context2.sent;
                varinatComparePrice = compare_variant_unit_price ? compare_variant_unit_price * (variant === null || variant === void 0 ? void 0 : variant.quantity) : null;

                if (document.querySelector(".mini-cart-list")) {
                  minicartItemHTML = "\n                <div class=\"single-mcart-item\">\n                    <div class=\"mcart-thumb\">\n                    <a href=\"/products/".concat(variant === null || variant === void 0 ? void 0 : variant.handle, "\"\n                        title=\"").concat(variant === null || variant === void 0 ? void 0 : variant.title, "\">\n                        <img src=\"").concat((variant === null || variant === void 0 ? void 0 : variant.image) || (variant === null || variant === void 0 ? void 0 : (_variant$featured_ima = variant.featured_image) === null || _variant$featured_ima === void 0 ? void 0 : _variant$featured_ima.url), "\" alt=\"").concat(variant === null || variant === void 0 ? void 0 : (_variant$featured_ima2 = variant.featured_image) === null || _variant$featured_ima2 === void 0 ? void 0 : _variant$featured_ima2.alt, "\">\n                    </a>\n                    </div>\n                    <div class=\"mcart-content\">\n                    <p class=\"mcart-single-title\"><a href=\"/products/").concat(variant === null || variant === void 0 ? void 0 : variant.handle, "\">").concat(variant === null || variant === void 0 ? void 0 : variant.title, "</a></p>\n                    <p class=\"mcart-single-price\">\n                        <span class=\"mcart-compare-price\">").concat(varinatComparePrice ? Currency.formatMoney(varinatComparePrice) : "", " </span>\n                        <span><b>").concat(Currency.formatMoney(variant === null || variant === void 0 ? void 0 : variant.final_line_price), "</b></span>\n                    </p>\n                    </div>\n                </div>\n            ");
                  document.querySelector(".mini-cart-list").insertAdjacentHTML('beforeend', minicartItemHTML);
                }

              case 5:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));
      return _renderItemtoMinicart.apply(this, arguments);
    }

    function getVariantComparePrice(_x3, _x4) {
      return _getVariantComparePrice.apply(this, arguments);
    }

    function _getVariantComparePrice() {
      _getVariantComparePrice = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(handle, variantId) {
        var _productFromHandle$da;

        var productFromHandle, productFromHandleVariants, giveVariant, givenVariantComparePrice;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!(!handle || !variantId)) {
                  _context3.next = 2;
                  break;
                }

                return _context3.abrupt("return");

              case 2:
                _context3.next = 4;
                return axios.get("/products/".concat(handle, ".js"));

              case 4:
                productFromHandle = _context3.sent;
                productFromHandleVariants = productFromHandle === null || productFromHandle === void 0 ? void 0 : (_productFromHandle$da = productFromHandle.data) === null || _productFromHandle$da === void 0 ? void 0 : _productFromHandle$da.variants;
                giveVariant = productFromHandleVariants.find(function (variant) {
                  return variant.id == variantId;
                });
                givenVariantComparePrice = giveVariant ? giveVariant.compare_at_price : null;
                return _context3.abrupt("return", (giveVariant === null || giveVariant === void 0 ? void 0 : giveVariant.price) >= givenVariantComparePrice ? null : givenVariantComparePrice);

              case 9:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));
      return _getVariantComparePrice.apply(this, arguments);
    }

    function addToCart() {
      // Add to cart button click
      if (document.querySelector('.pdp__content__control__add-to-cart-btn')) {
        document.querySelector('.pdp__content__control__add-to-cart-btn').addEventListener('click', function (e) {
          var _e$target, _e$target$closest$dat;

          // Show loader
          hideError();
          showLoaderAddToCartButton(); //Get id and quantity

          var variantIdString = e.target.dataset.id || (e === null || e === void 0 ? void 0 : (_e$target = e.target) === null || _e$target === void 0 ? void 0 : (_e$target$closest$dat = _e$target.closest('.pdp__content__control__add-to-cart-btn').dataset) === null || _e$target$closest$dat === void 0 ? void 0 : _e$target$closest$dat.id);
          var variantId = parseInt(variantIdString);
          var quantityString = document.querySelector(selectors.qtyElem).innerHTML;
          var quantity = quantityString ? parseInt(quantityString) : 1;

          if (quantity > 10) {
            hideLoaderAddToCartButton();
            showError("Cannot add more than 10 products.");

            if (document.querySelector('.pdp__content__control__qty__value')) {
              document.querySelector('.pdp__content__control__qty__value').innerHTML = 1;
            }

            return;
          }

          Cart.getState().then(function (cart) {
            var variantInCart = cart === null || cart === void 0 ? void 0 : cart.items.find(function (item) {
              return item.id == variantId;
            });

            if (variantInCart) {
              if (variantInCart.quantity + quantity > 10) {
                hideLoaderAddToCartButton();
                showError("Cannot add more than 10 products");

                if (document.querySelector('.pdp__content__control__qty__value')) {
                  document.querySelector('.pdp__content__control__qty__value').innerHTML = 1;
                }

                return;
              }
            } // Add item to the cart.


            Cart.addItem(variantId, {
              quantity: quantity
            }).then( /*#__PURE__*/function () {
              var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(res) {
                var handle, title, image, size, oPrice, compare_unit_price, oComparePrice, price, compare_price;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        // console.log('res', res);
                        handle = res === null || res === void 0 ? void 0 : res.handle;
                        title = res.product_title;
                        image = res.featured_image.url || res.image;
                        size = null;
                        oPrice = quantity ? res.price * quantity : res.price * 1;
                        _context.next = 7;
                        return getVariantComparePrice(handle, variantId);

                      case 7:
                        compare_unit_price = _context.sent;
                        // console.log('variantId', variantId);
                        // console.log('compare_unit_price :', compare_unit_price)
                        oComparePrice = compare_unit_price ? compare_unit_price * quantity : null;
                        price = oPrice ? Currency.formatMoney(oPrice) : null;
                        compare_price = oComparePrice ? Currency.formatMoney(oComparePrice) : null;

                        if (!res.product_has_only_default_variant) {
                          size = res.variant_options[0];
                        } // Update the mincart.


                        Cart.getState().then(function (cart) {
                          if (document.querySelector(".mini-cart-list")) {
                            document.querySelector(".mini-cart-list").innerHTML = "";
                          }

                          cart === null || cart === void 0 ? void 0 : cart.items.forEach(function (item) {
                            return renderItemtoMinicart(item);
                          }); // Hide no cart 

                          if (!document.querySelector('.cartempty_text').classList.contains('hide')) {
                            document.querySelector('.cartempty_text').classList.add('hide');
                          } // cart title 


                          if (document.querySelector('.mini-cart-title').classList.contains('hide')) {
                            document.querySelector('.mini-cart-title').classList.remove('hide');
                          } // Show the cart buttton 


                          if (document.querySelector('.mcart-go-cart').classList.contains('hide')) {
                            document.querySelector('.mcart-go-cart').classList.remove('hide');
                          }
                        })["catch"](function (error) {
                          console.log("Error on current cart fetch.");
                          console.log(error);
                        }); // Reset counter 

                        resetCount(); // Update the bubble

                        updateBubble(quantity); // Show added modal

                        openAddedtoCartModal(title, image, quantity, price, compare_price, size); // Hide loader 

                        hideLoaderAddToCartButton();

                      case 17:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x5) {
                return _ref.apply(this, arguments);
              };
            }())["catch"](function (err) {
              //Error
              console.log("Error adding the product.");
              console.log(err); // Hide loader 

              hideLoaderAddToCartButton();
              showError("Available quantity limit reached");
            });
          })["catch"](function (error) {
            console.log("Error on current cart fetch.");
            console.log(error);
          });
        });
      } // Added to cart overlay click - close


      if (document.querySelector('.pdpmodal-addedtocart__overlay')) {
        document.querySelector('.pdpmodal-addedtocart__overlay').addEventListener('click', function () {
          document.querySelector('.pdpmodal-addedtocart__overlay').style.display = "none";
          document.querySelector('.pdpmodal-addedtocart__modal').style.display = "none";
        });
      } // Close button in the modal click.


      if (document.querySelector('.pdpmodal-addedtocart__modal__close-btn')) {
        document.querySelector('.pdpmodal-addedtocart__modal__close-btn').addEventListener('click', function () {
          document.querySelector('.pdpmodal-addedtocart__overlay').style.display = "none";
          document.querySelector('.pdpmodal-addedtocart__modal').style.display = "none";
        });
      } // Disable click on modal from closing


      if (document.querySelector('.pdpmodal-addedtocart__modal')) {
        document.querySelector('.pdpmodal-addedtocart__modal').addEventListener('click', function () {});
      }
    }

    function pdpAddedToCartModalListeners() {
      if (document.querySelector('.pdpmodal-addedtocart__modal__checkout')) {
        document.querySelector('.pdpmodal-addedtocart__modal__checkout').addEventListener('click', function () {
          location.assign('/cart');
        });
      }

      if (document.querySelector('.pdpmodal-addedtocart__modal__continue')) {
        document.querySelector('.pdpmodal-addedtocart__modal__continue').addEventListener('click', function () {
          document.querySelector('.pdpmodal-addedtocart__overlay').style.display = "none";
          document.querySelector('.pdpmodal-addedtocart__modal').style.display = "none";
        });
      }
    }

    function countListeners() {
      var countAdd = document.querySelector('.pdp__content__control__qty__next');
      var countRemove = document.querySelector('.pdp__content__control__qty__prev');
      var countValue = document.querySelector('.pdp__content__control__qty__value');
      countAdd && countAdd.addEventListener('click', function () {
        var currentCount = parseInt(countValue.innerHTML.slice());
        currentCount = currentCount + 1;
        countValue.innerHTML = currentCount;
      });
      countRemove && countRemove.addEventListener('click', function () {
        var currentCount = parseInt(countValue.innerHTML.slice());

        if (currentCount != 1) {
          currentCount = currentCount - 1;
          countValue.innerHTML = currentCount;
        }
      });
    } // const masterGalleryHTMLString = `
    //     <div class="pdp__media__master__slide">
    //         <img src="{{ image | img_url: '500x', scale: 2 }}" alt="" class="pdp__media__master__slide__img">
    //     </div>
    // `;


    function showLoader() {
      var shimmer = document.querySelector('.pdp__media__shimmer');
      shimmer.style.display = "block";
    }

    function hideLoader() {
      var shimmer = document.querySelector('.pdp__media__shimmer');
      shimmer.style.display = "none";
    }

    function hideSlides() {
      document.querySelector('.pdp__media__master').style.opacity = 0;
      document.querySelector('.pdp__media__master').style.visibility = "hidden";
      document.querySelector('.pdp__media__thumbs').style.opacity = 0;
      document.querySelector('.pdp__media__thumbs').style.visibility = "hidden";
    }

    function showSlides() {
      document.querySelector('.pdp__media__master').style.opacity = 1;
      document.querySelector('.pdp__media__master').style.visibility = "visible";
      document.querySelector('.pdp__media__thumbs').style.opacity = 1;
      document.querySelector('.pdp__media__thumbs').style.visibility = "visible";
    }

    function renderVideoSources(slide) {
      if (!slide) return;
      return slide.sources.map(function (source) {
        return "<source src=\"".concat(source.url, "\" type=\"").concat(source.mime_type, "\"/>");
      }).join('');
    }

    function swatchListeners() {
      var swatches = document.querySelectorAll('.pdp__content__swatches__item');
      swatches && swatches.forEach(function (swatch) {
        swatch.addEventListener('click', function (e) {
          // Hide slides and show loader
          showLoader();
          hideSlides(); // Reset the counter

          if (document.querySelector('.pdp__content__control__qty__value')) {
            document.querySelector('.pdp__content__control__qty__value').innerHTML = "1";
          }

          var selectedOption = e.target.dataset.option; // console.log("Selected Option is : " + selectedOption);
          // Get Selected Variant using data-option attribute.

          var variants = window.objectData.product && window.objectData.product.variants;
          var selectedVariant = variants.find(function (v) {
            return v.option1 == selectedOption;
          }); // console.log("Selected Varaint is ") 
          // console.log(selectedVariant);
          //Change the swatch active.

          swatches.forEach(function (swatch) {
            swatch.classList.remove('active');
          });
          this.classList.add('active'); //Change the title, size, price.

          document.querySelector('.pdp__content__price__original').innerHTML = Currency.formatMoney(selectedVariant.price);

          if (selectedVariant.compare_at_price && selectedVariant.compare_at_price > selectedVariant.price) {
            document.querySelector('.pdp__content__price__compare').innerHTML = Currency.formatMoney(selectedVariant.compare_at_price);
          } else {
            document.querySelector('.pdp__content__price__compare').innerHTML = "";
          }

          document.querySelector('.pdp__content__size').innerHTML = selectedVariant.option1; // Change the size label in mobile

          document.querySelector('.pdp__info-mobile__size').innerHTML = selectedVariant.option1; //Change data-id on CTAButtons;

          document.querySelector('.pdp__content__control__add-to-cart-btn') ? document.querySelector('.pdp__content__control__add-to-cart-btn').dataset.id = selectedVariant.id : null;
          document.querySelector('.pdp__content__control__notify-me-btn') ? document.querySelector('.pdp__content__control__notify-me-btn').dataset.id = selectedVariant.id : null; //Update the Sliders.

          var medias = window.objectData.product.media;
          var meidaFilterText = "_".concat(selectedOption, "_");
          var selectedImages = medias.filter(function (item) {
            return item.alt && item.alt.includes(meidaFilterText);
          });
          var masterGalleryHTMLString = "";
          selectedImages.forEach(function (slide) {
            if (slide.media_type === "image") {
              var slideHTML = "\n                            <div class=\"pdp__media__master__slide\">\n                                <img src=\"".concat(slide === null || slide === void 0 ? void 0 : slide.src, "\" alt=\"").concat(slide === null || slide === void 0 ? void 0 : slide.alt, "\" class=\"pdp__media__master__slide__img\">\n                            </div>\n                        ");
              masterGalleryHTMLString = masterGalleryHTMLString + slideHTML;
            }

            if (slide.media_type === "video") {
              var _slideHTML3 = "\n                            <div class=\"pdp__media__master__slide\">\n                            <div class=\"pdp__media__master__slide__video-playbox\">\n                                <img src=\"https://cdn.shopify.com/s/files/1/0575/8517/2679/files/playbutton2.png?v=1627570945\" alt=\"\" class=\"pdp__media__master__slide__video-playbox__img\">\n                            </div>\n                                <video width=\"100%\" muted controls>".concat(renderVideoSources(slide), "</video>\n                            </div>\n                        ");

              masterGalleryHTMLString = masterGalleryHTMLString + _slideHTML3;
            }
          });
          var thumbsGalleryHTMLString = "";
          selectedImages.forEach(function (slide) {
            if (slide.media_type === "image") {
              var slideHTML = "\n                            <div class=\"pdp__media__thumbs__slide\">\n                                <img src=\"".concat(slide === null || slide === void 0 ? void 0 : slide.src, "\" alt=\"\" class=\"pdp__media__master__slide__img\">\n                            </div>\n                        ");
              thumbsGalleryHTMLString = thumbsGalleryHTMLString + slideHTML;
            }

            if (slide.media_type === "video") {
              var _slide$preview_image3, _slide$preview_image4;

              var _slideHTML4 = "\n                            <div class=\"pdp__media__thumbs__slide\">\n                                <div class=\"pdp__media__thumbs__slide__video-playbox\">\n                                    <img src=\"https://cdn.shopify.com/s/files/1/0575/8517/2679/files/playbutton2.png?v=1627570945\" alt=\"\" class=\"pdp__media__thumbs__slide__video-playbox__img\">\n                                </div>\n                                <img src=\"".concat(slide === null || slide === void 0 ? void 0 : (_slide$preview_image3 = slide.preview_image) === null || _slide$preview_image3 === void 0 ? void 0 : _slide$preview_image3.src, "\" alt=\"").concat(slide === null || slide === void 0 ? void 0 : (_slide$preview_image4 = slide.preview_image) === null || _slide$preview_image4 === void 0 ? void 0 : _slide$preview_image4.alt, "\" class=\"pdp__media__master__slide__img\">\n                            </div>\n                        ");

              thumbsGalleryHTMLString = thumbsGalleryHTMLString + _slideHTML4;
            }
          });

          if (masterGalleryHTMLString) {
            var countPlus = function countPlus() {
              counter = counter + 1;

              if (counter === allImgsLength) {
                // console.log("All Images loaded!")
                showSlides();
                hideLoader();
              }
            }; // console.log(allImgs);
            // allImgs.forEach(img => {
            //     img.addEventListener('load', () => console.log("hello laodded."))
            // })


            $('.pdp__media__master__slider').slick('unslick');
            $('.pdp__media__thumbs__slider').slick('unslick');
            document.querySelector('.pdp__media__master__slider').innerHTML = masterGalleryHTMLString;
            document.querySelector('.pdp__media__thumbs__slider').innerHTML = thumbsGalleryHTMLString;
            $('.pdp__media__master__slider').slick({
              dots: false,
              arrows: true,
              fade: true,
              prevArrow: $('.pdp__media__master__slider__arrow.pdp__media__master__slider__arrow-prev'),
              nextArrow: $('.pdp__media__master__slider__arrow.pdp__media__master__slider__arrow-next')
            });
            $('.pdp__media__thumbs__slider').slick({
              slidesToShow: 4,
              slidesToScroll: 1,
              dots: false,
              arrows: false,
              asNavFor: '.pdp__media__master__slider',
              focusOnSelect: true
            });
            var allImgs = document.querySelectorAll('.pdp__media__master__slide__img');
            var allImgsLength = allImgs.length;
            var counter = 0;
            [].forEach.call(allImgs, function (img) {
              if (img.complete) {
                countPlus();
              } else {
                img.addEventListener('load', countPlus, false);
              }
            });
          } // Update the CTA button on variant availablity


          document.querySelector('.pdp__content__control');
          var ctaAddToCart = document.querySelector('.pdp__content__control__add-to-cart-btn');
          var ctaNotifyMe = document.querySelector('.pdp__content__control__notify-me-btn');

          if (selectedVariant.available) {
            ctaNotifyMe.style.display = "none";
            ctaAddToCart.style.display = "grid";
          } else {
            ctaAddToCart.style.display = "none";
            ctaNotifyMe.style.display = "grid";
          }
        });
      });
    } // PDP accordion


    function accordion() {
      var customAccordions = document.querySelectorAll(selectors.accordionHeading); // console.log(customAccordions)

      customAccordions && customAccordions.forEach(function (accordion) {
        accordion.addEventListener('click', function (e) {
          // console.log(e.target);
          var body = e.target.closest(selectors.accordionItem).querySelector(selectors.accordionBody);

          if (body.classList.contains('active')) {
            body.classList.remove('active');
            gsap.to(body, {
              height: 0
            });
          } else {
            body.classList.add('active');
            gsap.to(body, {
              height: "auto"
            });
          }
        });
      });
    }

    return {
      init: function init() {
        countListeners();
        swatchListeners();
        pdpAddedToCartModalListeners();
        addToCart();
        accordion();
      }
    };
  }();

  var RelatedProductSlider = function () {
    return {
      init: function init() {
        $('.pdp-like__slider').slick({
          slidesToShow: 5,
          dots: false,
          arrows: true,
          lazyload: 'anticipated',
          prevArrow: $('.pdp-like__slider__arrow.pdp-like__slider__arrow-prev'),
          nextArrow: $('.pdp-like__slider__arrow.pdp-like__slider__arrow-next'),
          responsive: [{
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3
            }
          }, {
            breakpoint: 600,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2
            }
          }, {
            breakpoint: 480,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2
            }
          }]
        });
      }
    };
  }();

  var SparxScripts = function () {
    return {
      init: function init() {
        $(document).ready(function () {
          $('.lp-products').slick({
            slidesToShow: 6,
            slidesToScroll: 1,
            arrows: true,
            infinite: false,
            responsive: [{
              breakpoint: 992,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 1
              }
            }, {
              breakpoint: 480,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 1
              }
            }]
          }); //Scroll top fixed nav

          var previousScroll = 0;
          jQuery(window).scroll(function (e) {
            var i = $(this).scrollTop();
            i < previousScroll ? i > 300 && ($('body').addClass('nav-is-fixed'), $('.mb-top-logo, .mb-dt-nav-cont').addClass('animate__animated animate__fadeInDown')) : (i < 300 && $('body').removeClass('nav-is-fixed'), $('.mb-top-logo, .mb-dt-nav-cont').removeClass('animate__animated animate__fadeInDown'), $('body').removeClass('nav-is-fixed')), previousScroll = i;
          });
          $(document).scroll(function () {
            if ($(document).scrollTop() < 39) {
              $('body').removeClass('nav-is-fixed');
              $('.mb-top-logo, .mb-dt-nav-cont').removeClass('animate__animated animate__fadeInDown');
            }
          });
          $('li.has-subs').hover(function () {
            $('html').addClass('nav-is-ready');
            $(this).addClass('link-is-active');
          }, function () {
            $('html').removeClass('nav-is-ready');
            $(this).removeClass('link-is-active');
          });
          /* Mobile Nav */

          jQuery(document).on('click', '.mb-burger-icon', function (e) {
            $('html').toggleClass('overh');
            $('#mb-mob-nav-cont').toggleClass('hide show');
            $('a[nav-lvl-three="ok"]').parent().parent().addClass('show');
            $('a[nav-lvl-three="ok"]').parent().parent().parent().find('.togglenewmob.lvltwomob span.mobile-nav__label').addClass('bold');
            $('a[nav-lvl-three="ok"]').parent().parent().parent().find('.togglenewmob.lvltwomob .mobile-nav__icon').addClass('mobchiv-up');
            $('a[nav-lvl-two="ok"]').parent().parent().addClass('show');
            $('a[nav-lvl-a="ok"][aria-current="page"]').parent().parent().parent('.li-lvlone').find('.togglenewmob.lvlonemob span.mobile-nav__label').addClass('bold');
            $('a[nav-lvl-a="ok"][aria-current="page"]').parent().parent().parent('.li-lvlone').find('.togglenewmob.lvlonemob .mobile-nav__icon').addClass('mobchiv-up');
            $('a[nav-lvl-a="ok"][aria-current="page"]').parent().parent().parent('.li-lvlone').find('ul.innercontent[data-level="2"]').addClass('show');
            $('a[nav-lvl-a="ok"][aria-current="page"]').parent().parent().parent('.li-lvlone').find('ul.innercontent[data-level="2"] li').siblings('.li-lvltwo').first().find('.togglenewmob.lvltwomob .mobile-nav__icon').addClass('mobchiv-up');
            $('a[nav-lvl-a="ok"][aria-current="page"]').parent().parent().parent('.li-lvlone').find('ul.innercontent[data-level="2"] li').siblings('.li-lvltwo').first().find('.togglenewmob.lvltwomob span.mobile-nav__label').addClass('bold');
            $('a[nav-lvl-a="ok"][aria-current="page"]').parent().parent().parent('.li-lvlone').find('ul.innercontent[data-level="2"] li').siblings('.li-lvltwo').first().find('ul.innercontent[data-level="3"]').addClass('show');
          });
          $('#mob-mnu-close').click(function (e) {
            $('html').toggleClass('overh');
            $('#MobileNav').toggleClass('hide show');
          });
          $('.togglenewmob').click(function (e) {
            e.preventDefault();
            var $this = $(this);

            if ($this.next().hasClass('show')) {
              $this.next().removeClass('show');
            } else {
              $this.parent().parent().find('li .innercontent').removeClass('show');
              $this.next().toggleClass('show');
            }
          });
          $('.lvlonemob').click(function (e) {
            e.preventDefault();
            $('.li-lvltwo span.mobile-nav__label').removeClass("bold");
            $('.li-lvltwo .lvltwomob-chiv').removeClass('mobchiv-up');

            if ($(this).find('.lvlonemob-chiv').hasClass('mobchiv-up')) {
              $('.mobile-nav__label').removeClass("bold");
              $('.lvlonemob-chiv').removeClass('mobchiv-up');
            } else {
              $('.lvlonemob-chiv').removeClass('mobchiv-up');
              $('.lvlonemob .mobile-nav__label').removeClass("bold");
              $(this).find('.mobile-nav__label').addClass("bold");
              $(this).find('.lvlonemob-chiv').addClass("mobchiv-up");
            }

            $(this).parent('.li-lvlone').find('ul.innercontent[data-level="2"] li').siblings('.li-lvltwo').first().find('ul.innercontent[data-level="3"]').addClass('show');
            $(this).parent('.li-lvlone').find('ul.innercontent[data-level="2"] li').siblings('.li-lvltwo').first().find('.togglenewmob.lvltwomob .mobile-nav__label').addClass('bold');
            $(this).parent('.li-lvlone').find('ul.innercontent[data-level="2"] li').siblings('.li-lvltwo').first().find('.togglenewmob.lvltwomob .mobile-nav__icon').addClass('mobchiv-up');
          });
          $('.lvltwomob').click(function (e) {
            e.preventDefault();

            if ($(this).find('.lvltwomob-chiv').hasClass('mobchiv-up')) {
              $('.lvltwomob .mobile-nav__label').removeClass("bold");
              $('.lvltwomob-chiv').removeClass('mobchiv-up');
            } else {
              $('.lvltwomob-chiv').removeClass('mobchiv-up');
              $('.lvltwomob .mobile-nav__label').removeClass("bold");
              $(this).find('.mobile-nav__label').addClass("bold");
              $(this).find('.lvltwomob-chiv').addClass("mobchiv-up");
            }
          });
          /* End Mobile Nav */

          $(function (e) {
            $(".addqty").click(function () {
              var currentVal = parseInt($(this).prev(".qtycart").val());

              if (currentVal != NaN) {
                $(this).prev(".qtycart").val(currentVal + 1);
              }
            });
            $(".minusqty").click(function () {
              var currentVal = parseInt($(this).next(".qtycart").val());

              if (currentVal != NaN) {
                if (currentVal > 1) {
                  $(this).next(".qtycart").val(currentVal - 1);
                }
              }
            });
          }); // $('.mb-cart-flex').click(function () {
          //   $('.mini-cart-content').toggleClass('hide');
          // });

          $(document).click(function (e) {
            var mcart_cont = $(".mb-cart-flex");

            if (!mcart_cont.is(e.target) && mcart_cont.has(e.target).length === 0) {
              $('.mini-cart-content').addClass('hide');
            }
          });
        });
        /* End Doc ready */
        // Sahid 

        $(document).ready(function () {
          if ($(window).width() < 750) {
            $(".footer-header").click(function () {
              if ($(this).parents(".footer-item").hasClass("active-item")) {
                $(".footer-item").removeClass("active-item");
                $(".footer-body").slideUp("slow");
              } else {
                $(".footer-item").removeClass("active-item");
                $(".footer-body").slideUp("slow");
                $(this).parents(".footer-item").addClass("active-item");
                $(this).next(".footer-body").slideDown("slow");
              }
            });
          } // Account address code here

        }); // Harshita 

        $(document).ready(function () {
          // search box toggle js
          $("#searchbar .search-label").on("click", function (e) {
            e.preventDefault();
            $("#searchbar").toggleClass("collapsed");
          }); // product search js

          /*
          $(".search-input").bind("keyup", function (e) {
            if (this.value.length < 3) {
              // console.log(this.value.length);
              //$("#productData").html('');
              //$("#viewResults").html('');
              $(".search-result-weap").hide();
            } else if (this.value.length >= 3) {
              var searchKeyword = this.value; //$(".search-result-weap").show();
            }
             jQuery.getJSON("/search/suggest.json", {
              q: searchKeyword,
              resources: {
                type: "product",
                options: {
                  unavailable_products: "last",
                  fields: "title,product_type,variants.title"
                }
              }
            }).done(function (response) {
              var productSuggestions = response.resources.results.products;
              var pro_length = productSuggestions.length; //console.log(finalColldata.id);
               if (productSuggestions.length > 0) {
                var str = "";
                var show_counter = 1;
                 for (var i = 0; i < pro_length; i++) {
                  if (show_counter <= 3) {
                    $(".search-result-weap").show();
                    var firstProductSuggestion = productSuggestions[i];
                    str += '<a href="' + firstProductSuggestion.url + '" class="search-result-items"><div class="get-product-image"><img src="' + firstProductSuggestion.image + '"></div>' + '<div class="get-product-title">' + firstProductSuggestion.title + "</div>" + '<div class="get-product-price">' + firstProductSuggestion.price + "</div></a>"; //console.log("The title of the first product suggestion is: " + firstProductSuggestion.id);
                    //console.log(firstProductSuggestion.title);
                     show_counter = show_counter + 1;
                  }
                }
                 $(".productData").html(str);
                 if (pro_length > 3) {
                  $(".viewResults").html("More Results");
                }
                 $(".customSearchredirect").attr("href", "/search?q=" + searchKeyword + "&type=product");
              }
            });
          }); 
          */
          // account page tab js

          $(".tabs-main li").click(function () {
            var tab_id = $(this).attr("data-tab");
            $(".tabs-main li").removeClass("current");
            $(".tabs-items").removeClass("current");
            $(this).addClass("current");
            $("." + tab_id).addClass("current");
          });
          $(".template-customers-addresses .tabs-main li.current").click(function () {
            $(".template-customers-addresses .my_address").addClass("current");
          }); // customer order tab

          var url = window.location.href;
          var pageURL = url.split("#").pop();
          pageURL.split("+");

          if (pageURL == "my_order") {
            $(".tab-link").removeClass("current");
            $(".tabs-items").removeClass("current");
            $("#my_order").parent().addClass("current");
            $(".my_order").addClass("current");
          }
        }); // Deepak

        $(document).ready(function () {
          // $(".toggle-password").click(function () {
          //   $(this).toggleClass("fa-eye fa-eye-slash");
          //   var input = $('.password-splash');
          //   if (input.attr("type") == "password") {
          //     input.attr("type", "text");
          //   } else {
          //     input.attr("type", "password");
          //   }
          // });
          // $(".toggle-password-conf").click(function () {
          //   $(this).toggleClass("fa-eye fa-eye-slash");
          //   var input = $('.password-splash-conf');
          //   if (input.attr("type") == "password") {
          //     input.attr("type", "text");
          //   } else {
          //     input.attr("type", "password");
          //   }
          // });
          // hide show password 
          $(".password-action").click(function () {
            $(this).toggleClass("active");
            var input = $(this).parent().find("input");

            if (input.attr("type") == "password") {
              input.attr("type", "text");
            } else {
              input.attr("type", "password");
            }
          });
          var inputError = false;
          $(".password-splash-conf").on('keyup', function (event) {
            if (event.target.value != document.getElementById('RegisterForm-password').value) {
              console.log('ppp');
              inputError = true;
            } else {
              inputError = false;
              $('.error-msg').hide();
            }
          });
          $(document).on('click', function (event) {
            if (inputError) {
              $('.error-msg').show();
            } else {
              $('.error-msg').hide();
            }
          }); // cart page cart note count

          $("#CartSpecialInstructions").on('keyup', function () {
            var notemsg = $(this).val();
            $('#CartNote').text('Gift Box : Yes\nGift Message : ' + notemsg);
            $("#countcharacter").text(250 - $(this).val().length + " Characters");
          });
        });
        $(document).ready(function () {
          // accordion js start
          $(".accordion_header").click(function () {
            if ($(this).parents(".accordion_items").hasClass("active-item")) {
              $(".accordion_items").removeClass("active-item");
              $(".accordion_body").slideUp("slow");
            } else {
              $(".accordion_items").removeClass("active-item");
              $(".accordion_body").slideUp("slow");
              $(this).parents(".accordion_items").addClass("active-item");
              $(this).next(".accordion_body").slideDown("slow");
            }
          });
        }); // jQuery(document).on("click",".register-footer .btn",function(event) {
        //   event.stopPropagation();
        //   jQuery(".register-overlay").show().addClass("open");
        //   jQuery(".model-content.reg-modal").show();
        // });

        jQuery(document).on("click", ".model-content.reg-modal .close-modal,.register-overlay", function (event) {
          event.stopPropagation();
          jQuery(".register-overlay").hide().removeClass("open");
          jQuery(".model-content.reg-modal").hide();
        });
        /**
        *
        *  Show/hide customer address forms
        *
        */

        var address_list_container = document.getElementById('cus_address-list');
        var newAddressForm = document.getElementById('AddressNewForm');
        var newAddressFormButton = document.getElementById('AddressNewButton');
        var deletedTarget; // Toggle new/edit address forms

        document.querySelectorAll('.address-new-toggle').forEach(function (button) {
          button.addEventListener('click', function () {
            var isExpanded = newAddressFormButton.getAttribute('aria-expanded') === 'true';
            newAddressForm.classList.toggle('hide');
            address_list_container.classList.toggle('show');
            newAddressFormButton.setAttribute('aria-expanded', !isExpanded);
            newAddressFormButton.focus();
          });
        });
        document.querySelectorAll('.address-edit-toggle').forEach(function (button) {
          button.addEventListener('click', function (evt) {
            var formId = evt.target.dataset.formId;
            var editButton = document.getElementById('EditFormButton_' + formId);
            var editAddress = document.getElementById('EditAddress_' + formId);
            var isExpanded = editButton.getAttribute('aria-expanded') === 'true';
            editAddress.classList.toggle('hide');
            editButton.setAttribute('aria-expanded', !isExpanded);
            editButton.focus();
            $('#default_' + formId + ' input[type=checkbox]').prop('checked', 'checked');
          });
        });
        var fountHtm = setInterval(function () {
          if (document.getElementById("address-remove")) {
            clearInterval(fountHtm);
            document.getElementById("address-remove").addEventListener("click", function () {
              Shopify.postLink(deletedTarget, {
                parameters: {
                  _method: 'delete'
                }
              });
            });
          }
        }, 1000);
        document.querySelectorAll('.address-delete').forEach(function (button) {
          button.addEventListener('click', function (evt) {
            var target = evt.target.dataset.target;
            evt.target.dataset.confirmMessage;
            deletedTarget = target; //console.log("555555555555555555555555555555");

            $("#cnf-msg").show();
            $(".address_popup_overlay").show();
          });
        }); // custom filter code 27-07-2021

        $(document).ready(function () {
          if ($(window).width() <= 768) {
            $(document).on("click", ".custom-boots h5 svg", function () {
              $(this).parents(".custom-boots").hide();
              $(".boost-pfs-filter-sort-active").removeClass("boost-pfs-filter-sort-active");
              $(".boost-pfs-filter-filter-dropdown").hide();
            });
          }
        });
        $("#view-order-d").click(function () {
          $("a#my_order").click();
        });
        $("#view-order-m").click(function () {
          $("a#my_order").click();
        }); // harshita cart page 30-7

        $('.giftyes').click(function () {
          if ($(this).is(':checked')) {
            $('#CartNote').text('Gift Box : Yes\nGift Message : None');
            $(".gift_msg").fadeIn();
          } else {
            $('#CartNote').text('Gift Box : No\nGift Message : None');
            $(".gift_msg").fadeOut();
          }
        }); // remove js popup modal

        $(".address-cancle-btn").click(function () {
          $("#cnf-msg").hide();
          $(".address_popup_overlay").hide();
        });
        $(".address_popup_close").click(function () {
          $(".address-cancle-btn").click();
        }); // andrew cart page coopen 

        $('#redemDevPromo').on('click', function (event) {
          //disable the button event
          event.preventDefault(); //write the url format

          var theUrl = '/checkout?discount='; //grab the discount code from the input

          var theDiscount = $('#promo_coupon').val(); //full url to redirect to checkout with promo code

          if (!theDiscount) {
            $('.errormessage').text('Please Enter Valid Coupon Code');
            $('#promo_coupon').addClass('error-promo');
          } else {
            var toRedirect = theUrl + theDiscount;
            console.log(toRedirect); //redirect

            window.location.href = toRedirect;
          }
        });
        jQuery(".promo-title").click(function () {
          jQuery(".promo-body").slideToggle();
        }); // harshita 2 aug

        $(document).ready(function () {
          $("a#RecoverPassword").click(function () {
            $("div#recover_form").show();
            $("form#customer_login").hide();
          });
          $("a#HideRecoverPasswordLink").click(function () {
            $("div#recover_form").hide();
            $("form#customer_login").show();
          });
        }); // deepak 2 aug

        $("document").ready(function () {
          $(".find-store").hover(function () {
            $(this).find(".uae-select").addClass("open");
          }, function () {
            $(this).find(".uae-select").removeClass("open");
          });
        }); // lp products js

        var rtlView = Shopify.locale == "ar" ? true : false; // home product list slider js start 

        $(document).ready(function () {
          $('.grid-slider-five').slick({
            slidesToShow: 4.999999,
            dots: false,
            arrows: true,
            autoplaySpeed: 1800,
            autoplay: true,
            rtl: rtlView,
            centerMode: true,
            lazyload: 'anticipated',
            prevArrow: $('.pdp-like__slider__arrow.pdp-like__slider__arrow-prev'),
            nextArrow: $('.pdp-like__slider__arrow.pdp-like__slider__arrow-next'),
            slidesToScroll: 1,
            responsive: [{
              breakpoint: 1024,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 1
              }
            }, {
              breakpoint: 767,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 1
              }
            }, {
              breakpoint: 480,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1
              }
            }]
          });
          document.querySelector(".hm-product-slider").style.opacity = 1;
        }); // home product list slider js end

        /* home product slider loader starts */

        document.onreadystatechange = function () {
          if (document.readyState !== "complete") {
            document.querySelector(".hm-product-slider").style.visibility = "hidden";
            document.querySelector(".loading-dots").style.visibility = "visible";
          } else {
            document.querySelector(".loading-dots").style.display = "none";
            document.querySelector(".hm-product-slider").style.visibility = "visible";
          }
        };
        /* home product slider loader ends*/

      }
    };
  }();

  var HomeSliderSparx = function () {
    return {
      init: function init() {
        jQuery(".Home_slideshow").slick({
          speed: 1000,
          slidesToShow: 1,
          //autoplay:true,
          //autoplaySpeed: 10000,   
          //slidesToScroll: 1,
          dots: true,
          arrows: false
        });
        $(document).on("click", ".videoPoster", function (ev) {
          ev.preventDefault();
          videoStop();
          var $poster = $(this).closest('.video-containerss');
          videoPlay($poster);
        }); // play the targeted video (and hide the poster frame)

        function videoPlay($wrapper) {
          var $iframe = $wrapper.prev();
          $wrapper.hide();
          $wrapper.parent('.vides-padding').addClass("stopVid");
          $iframe.css('height', $wrapper.parent('.vides-padding').css('height'));
          $iframe.show();
          $iframe[0].play();
        }

        function videoStop() {
          $(".video-containerss").show();
          $('.vides-padding').removeClass("stopVid");
          $('.responsive-iframe').hide();
          var elems1 = document.getElementsByClassName('responsive-iframe');

          for (var i = 0; i < elems1.length; i++) {
            elems1[i].style.height = 0;
            elems1[i].pause();
            elems1[i].currentTime = 0;
          }
        }

        $(".Home_slideshow").on("beforeChange", function (event, slick, currentSlide, nextSlide) {
          videoStop();
        });
        var elems1 = document.getElementsByClassName('responsive-iframe');

        for (var i = 0; i < elems1.length; i++) {
          elems1[i].onplay = function () {
            $('.Home_slideshow').slick('slickPause');
          };

          elems1[i].onpause = function () {
            console.log("paused");
            $('.Home_slideshow').slick('slickPlay');
          };
        }

        var parent = $('.vides-padding'),
            child = parent.children('.responsive-iframe');

        if (child.height() < parent.height()) {
          parent.height(child.height());
        }

        $(document).ready(function () {
          var divHeight = $('.iner-two').height();
          $('.responsive-iframe').css('min-height', divHeight + 'px');
        });
      }
    };
  }(); //header padding navigation


  window.onresize = function () {
    var tabby = document.getElementById('shopify-section-header-top-tabby').offsetHeight;
    var header_section = document.getElementById('shopify-section-header').offsetHeight;
    var nav_padding = tabby + header_section - 1;
    document.getElementById('mb-mob-nav-cont').style.top = nav_padding + 'px';
  };

  window.dispatchEvent(new Event("resize"));

  var HomepageHeroSliderView = /*#__PURE__*/function () {
    function HomepageHeroSliderView() {
      _classCallCheck(this, HomepageHeroSliderView);
    }

    _createClass(HomepageHeroSliderView, [{
      key: "initSlider",
      value: function initSlider() {
        jQuery(".h__slider").slick({
          speed: 1000,
          slidesToShow: 1,
          autoplay: true,
          autoplaySpeed: 10000,
          slidesToScroll: 1,
          dots: true,
          arrows: true
        });
      }
    }, {
      key: "addHandlerClicks",
      value: function addHandlerClicks(handler) {
        window.addEventListener('load', function () {
          var videos = document.querySelectorAll('.h__slide__video');
          videos && videos.forEach(function (video) {
            video.addEventListener('click', function (e) {
              return handler(e);
            });
          });
        });
      }
    }]);

    return HomepageHeroSliderView;
  }();

  var HomepageHeroSliderView$1 = new HomepageHeroSliderView(); //  Return to Hompage script

  var return_hp = document.querySelector(".return_to_hp");
  return_hp.addEventListener('click', function () {
    document.querySelector(".mb-burger-icon").click();
  });
  var state = {
    relatedProducts: null
  };

  var getAllProductsWithType = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(language, type) {
      var queryString, _getProductsResultDat, _getProductsResultDat2, query, getProductsResult, getProductsResultData, formattedProducts;

      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              queryString = "";
              if (type) queryString = "product_type:".concat(type);
              _context4.prev = 2;
              query = "\n      query GET_PRODUCTS {\n          products (first: 10, query:\"".concat(queryString, "\") {\n              edges {\n                  node {\n                    availableForSale\n                    title                                          \n                    handle\n                    productType\n                    totalInventory    \n                    \n                    variants(first: 10) {\n                      edges {\n                        node {             \n                          availableForSale                                                                    \n                        }\n                      }\n                    }                      \n\n                    images(first:1) {\n                      edges {\n                        node {\n                          altText\n                          originalSrc\n                        }\n                      }\n                    }\n                    priceRange {\n                      minVariantPrice {\n                        amount\n                      }\n                    }\n                    compareAtPriceRange {\n                      maxVariantPrice {\n                        amount\n                      }\n                    }\n                  }\n              }\n        }\n      }\n    ");
              _context4.next = 6;
              return axios.post('https://molton-brown-uae.myshopify.com/api/2021-07/graphql.json', {
                query: query
              }, {
                headers: {
                  "Content-Type": "application/json",
                  "X-Shopify-Storefront-Access-Token": "262dbacef9d26e53dfff834b460386d6",
                  "Accept-Language": language
                }
              });

            case 6:
              getProductsResult = _context4.sent;
              getProductsResultData = getProductsResult.data;

              if (getProductsResultData) {
                _context4.next = 11;
                break;
              }

              state.relatedProducts = [];
              return _context4.abrupt("return");

            case 11:
              formattedProducts = getProductsResultData === null || getProductsResultData === void 0 ? void 0 : (_getProductsResultDat = getProductsResultData.data) === null || _getProductsResultDat === void 0 ? void 0 : (_getProductsResultDat2 = _getProductsResultDat.products) === null || _getProductsResultDat2 === void 0 ? void 0 : _getProductsResultDat2.edges.map(function (edge) {
                var _edge$node, _edge$node2, _edge$node3, _edge$node4, _edge$node5, _edge$node5$images, _edge$node5$images$ed, _edge$node6, _edge$node6$variants, _edge$node6$variants$, _edge$node7, _edge$node7$priceRang, _edge$node7$priceRang2, _edge$node8, _edge$node8$compareAt, _edge$node8$compareAt2;

                return {
                  "productType": edge === null || edge === void 0 ? void 0 : (_edge$node = edge.node) === null || _edge$node === void 0 ? void 0 : _edge$node.productType,
                  "productAvailableForSale": edge === null || edge === void 0 ? void 0 : (_edge$node2 = edge.node) === null || _edge$node2 === void 0 ? void 0 : _edge$node2.availableForSale,
                  "title": edge === null || edge === void 0 ? void 0 : (_edge$node3 = edge.node) === null || _edge$node3 === void 0 ? void 0 : _edge$node3.title,
                  "handle": edge === null || edge === void 0 ? void 0 : (_edge$node4 = edge.node) === null || _edge$node4 === void 0 ? void 0 : _edge$node4.handle,
                  "image": edge === null || edge === void 0 ? void 0 : (_edge$node5 = edge.node) === null || _edge$node5 === void 0 ? void 0 : (_edge$node5$images = _edge$node5.images) === null || _edge$node5$images === void 0 ? void 0 : (_edge$node5$images$ed = _edge$node5$images.edges[0]) === null || _edge$node5$images$ed === void 0 ? void 0 : _edge$node5$images$ed.node,
                  "variants": edge === null || edge === void 0 ? void 0 : (_edge$node6 = edge.node) === null || _edge$node6 === void 0 ? void 0 : (_edge$node6$variants = _edge$node6.variants) === null || _edge$node6$variants === void 0 ? void 0 : (_edge$node6$variants$ = _edge$node6$variants.edges[0]) === null || _edge$node6$variants$ === void 0 ? void 0 : _edge$node6$variants$.node,
                  "productMinPrice": edge === null || edge === void 0 ? void 0 : (_edge$node7 = edge.node) === null || _edge$node7 === void 0 ? void 0 : (_edge$node7$priceRang = _edge$node7.priceRange) === null || _edge$node7$priceRang === void 0 ? void 0 : (_edge$node7$priceRang2 = _edge$node7$priceRang.minVariantPrice) === null || _edge$node7$priceRang2 === void 0 ? void 0 : _edge$node7$priceRang2.amount,
                  "productMaxPrice": edge === null || edge === void 0 ? void 0 : (_edge$node8 = edge.node) === null || _edge$node8 === void 0 ? void 0 : (_edge$node8$compareAt = _edge$node8.compareAtPriceRange) === null || _edge$node8$compareAt === void 0 ? void 0 : (_edge$node8$compareAt2 = _edge$node8$compareAt.maxVariantPrice) === null || _edge$node8$compareAt2 === void 0 ? void 0 : _edge$node8$compareAt2.amount
                };
              });

              if (formattedProducts) {
                _context4.next = 15;
                break;
              }

              state.relatedProducts = [];
              return _context4.abrupt("return");

            case 15:
              state.relatedProducts = formattedProducts;
              _context4.next = 21;
              break;

            case 18:
              _context4.prev = 18;
              _context4.t0 = _context4["catch"](2);
              console.log(_context4.t0.message);

            case 21:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, null, [[2, 18]]);
    }));

    return function getAllProductsWithType(_x6, _x7) {
      return _ref2.apply(this, arguments);
    };
  }();

  var RelatedProductsView = /*#__PURE__*/function () {
    function RelatedProductsView() {
      _classCallCheck(this, RelatedProductsView);

      _defineProperty(this, "parentElJQuery", $(".pdp-like__slider"));

      _defineProperty(this, "parentEl", document.querySelector(".pdp-like__slider"));

      _defineProperty(this, "_data", void 0);
    }

    _createClass(RelatedProductsView, [{
      key: "initSlider",
      value: function initSlider() {
        this.parentElJQuery.slick({
          slidesToShow: 5,
          dots: false,
          arrows: true,
          prevArrow: $(".pdp-like__slider__arrow.pdp-like__slider__arrow-prev"),
          nextArrow: $(".pdp-like__slider__arrow.pdp-like__slider__arrow-next"),
          responsive: [{
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3
            }
          }, {
            breakpoint: 600,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2
            }
          }, {
            breakpoint: 480,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2
            }
          }]
        });
      }
    }, {
      key: "render",
      value: function render(prods) {
        this._data = prods;
        if (!this._data || this._data.length < 1) return;
        this.parentElJQuery.slick("unslick");
        this.parentEl.innerHTML = "";

        var markup = this._generateMarkup();

        this.parentEl.insertAdjacentHTML("afterbegin", markup);
      }
    }, {
      key: "_clean",
      value: function _clean() {
        this.parentEl.innerHTML = "";
      }
    }, {
      key: "_generateMarkup",
      value: function _generateMarkup() {
        var _this2 = this;

        return this._data.map(function (prod) {
          return _this2._generateMarkupSlide(prod);
        }).join("");
      }
    }, {
      key: "_getComparePrice",
      value: function _getComparePrice(min, max) {
        if (min >= max) {
          return "";
        } else {
          return max ? Currency.formatMoney(max + "0") : "";
        }
      }
    }, {
      key: "_generateMarkupSlide",
      value: function _generateMarkupSlide(prod) {
        var _prod$variants, _prod$image, _prod$image2, _prod$image3;

        return "                     \n          <a href=\"/products/".concat(prod.handle, "\" class=\"pdp-like__slider__item ").concat((_prod$variants = prod.variants) === null || _prod$variants === void 0 ? void 0 : _prod$variants.availableForSale, "\">\n              <figure class=\"pdp-like__slider__item__imgbox\">\n                  <img src=\"").concat((_prod$image = prod.image) === null || _prod$image === void 0 ? void 0 : _prod$image.originalSrc, "\" alt=\"").concat((_prod$image2 = prod.image) !== null && _prod$image2 !== void 0 && _prod$image2.altText ? (_prod$image3 = prod.image) === null || _prod$image3 === void 0 ? void 0 : _prod$image3.altText : "", "\" class=\"pdp-like__slider__item__img\"/>\n              </figure>\n\n              <div class=\"pdp-like__slider__item__title\">").concat(prod === null || prod === void 0 ? void 0 : prod.title, "</div>\n              <div class=\"pdp-like__slider__item__price\">\n                  <div class=\"pdp-like__slider__item__price__original\">").concat(prod !== null && prod !== void 0 && prod.productMinPrice ? Currency.formatMoney((prod === null || prod === void 0 ? void 0 : prod.productMinPrice) + "0") : "", "</div>                \n                  <div class=\"pdp-like__slider__item__price__compare\">").concat(this._getComparePrice(prod === null || prod === void 0 ? void 0 : prod.productMinPrice, prod === null || prod === void 0 ? void 0 : prod.productMaxPrice), "</div>                \n              </div>\n          </a>\n        ");
      }
    }, {
      key: "addHandlerLoad",
      value: function addHandlerLoad(handler) {
        document.addEventListener("DOMContentLoaded", function () {
          handler();
        });
      }
    }]);

    return RelatedProductsView;
  }();

  var RelatedProductsView$1 = new RelatedProductsView();
  window.Cart = cart;
  document.addEventListener("DOMContentLoaded", function () {
    init$1();
    SparxScripts.init();
    HomeSliderSparx.init();

    if (window.objectData.template == "product" || window.objectData.template == "product.th-bundle") {
      MediaGallery.init();
      RelatedProductSlider.init();
      PDPListeners.init();
    }
  });

  var controlRelatedProducts = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
      var _window$objectData$pr, currentType;

      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              // 1. Get the Current product type
              currentType = (_window$objectData$pr = window.objectData.product) === null || _window$objectData$pr === void 0 ? void 0 : _window$objectData$pr.type;

              if (!langify) {
                _context5.next = 12;
                break;
              }

              if (!(langify.locale.iso_code === "ar")) {
                _context5.next = 8;
                break;
              }

              _context5.next = 6;
              return getAllProductsWithType("ar", currentType);

            case 6:
              _context5.next = 10;
              break;

            case 8:
              _context5.next = 10;
              return getAllProductsWithType("en", currentType);

            case 10:
              _context5.next = 14;
              break;

            case 12:
              _context5.next = 14;
              return getAllProductsWithType("en", currentType);

            case 14:
              RelatedProductsView$1.render(state.relatedProducts);
              RelatedProductsView$1.initSlider();
              _context5.next = 21;
              break;

            case 18:
              _context5.prev = 18;
              _context5.t0 = _context5["catch"](0);
              console.log(_context5.t0.message);

            case 21:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, null, [[0, 18]]);
    }));

    return function controlRelatedProducts() {
      return _ref3.apply(this, arguments);
    };
  }();

  var controlHomepageHeroBannerVideos = function controlHomepageHeroBannerVideos(e) {
    var parentEl = e.target.closest(".h__slide__inner");
    var allChildren = parentEl ? Array.from(parentEl.children) : null;
    if (!allChildren || allChildren.length < 1) return;
    var allVideoChildrens = allChildren.filter(function (child) {
      return child.localName == "video";
    });
    allVideoChildrens && allVideoChildrens.forEach(function (v) {
      if (v.paused) {
        v.play();
        v.closest(".h__slide__inner").querySelector(".h__slide__play-icon").classList.add("hide");
      } else {
        v.pause();
        v.closest(".h__slide__inner").querySelector(".h__slide__play-icon").classList.remove("hide");
      }
    });
  };

  function init() {
    HomepageHeroSliderView$1.addHandlerClicks(controlHomepageHeroBannerVideos);
    HomepageHeroSliderView$1.initSlider();

    if (window.objectData.template == "product" || window.objectData.template == "product.th-bundle") {
      RelatedProductsView$1.addHandlerLoad(controlRelatedProducts);
    }
  }

  window.$th_bundle_addtocart_callback = function () {
    $(".pdpmodal-addedtocart__modal").show();
    $(".pdpmodal-addedtocart__overlay").show();
    $("#shopify-section-header").load(location.href + " #shopify-section-header");
  };

  $(".pdpmodal-addedtocart__modal__close-btn, .pdpmodal-addedtocart__modal__continue").click(function () {
    $(".pdpmodal-addedtocart__modal").hide();
    $(".pdpmodal-addedtocart__overlay").hide();
  });
  jQuery(document).on("click", ".mb-cart-flex", function () {
    $(".mini-cart-content").toggleClass("hide");
  });
  init();
})();
//# sourceMappingURL=theme.js.map
