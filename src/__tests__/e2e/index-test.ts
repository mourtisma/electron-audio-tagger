import { screen } from '@testing-library/testcafe';

fixture`Getting Started`.page(
  '../../../.webpack/renderer/main_window/index.html',
);

test('Main page', async (t) => {
  await t
    .expect(
      screen.queryAllByText('Welcome to your Electron application.').exists,
    )
    .ok();
});
