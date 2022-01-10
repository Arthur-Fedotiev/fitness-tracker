import * as fromSettings from './settings.actions';

describe('setSettingss', () => {
  it('should return an action', () => {
    expect(fromSettings.setSettingss().type).toBe('[Settings] Set Settingss');
  });
});
