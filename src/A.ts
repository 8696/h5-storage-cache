// @ts-ignore
import B from './B.ts';

class A extends B {
  constructor() {
    super();
  }

  testA() {
    console.log('test A');
  }
}

export default A;
