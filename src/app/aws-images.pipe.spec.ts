import { AwsImagesPipe } from './aws-images.pipe';

describe('AwsImagesPipe', () => {
  it('create an instance', () => {
    const pipe = new AwsImagesPipe();
    expect(pipe).toBeTruthy();
  });
});
