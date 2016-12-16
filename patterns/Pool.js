// Based on Facebook's React PooledClass, albeit a generic one.
// Passes all original React's test cases.

function getInstance (...args) {
  // this points to the pooled class,
  // as getInstance is called with Class context
  if (this.__instancePool.length) {
    const instance = this.__instancePool.pop();
    this.apply(instance, args);
    return instance;
  }
  // no instance in pool, create new
  return new (Function.prototype.bind.apply(this, [null].concat(args)))();
}

function release (instance) {
  if (!(instance instanceof this)) {
    throw new Error('Trying to release an instance of a different type');
  }
  instance.destructor && instance.destructor();
  if (this.__instancePool.length < this.__poolSize) {
    this.__instancePool.push(instance);
  }
}

export default function Pool (klassToBePooled, poolSize) {
  const newClass = klassToBePooled;
  // store the instances back
  newClass.__instancePool = [];
  // get pooled instance or new
  newClass.getInstance = getInstance;
  // max pool size
  newClass.__poolSize = poolSize || 10;
  // function to release the instance
  newClass.release = release;
  return newClass;
}
