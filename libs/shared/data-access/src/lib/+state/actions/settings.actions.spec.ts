import * as fromSettings from './settings.actions';

describe('setSettings', () => {
  it('should return an action', () => {
    expect(fromSettings.setSettings().type).toBe('[Settings] Set Settingss');
  });
});
