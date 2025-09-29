import { renderFilterStatement } from './textFormatter';

describe('render', () => {
  it('renderFilterStatement', () => {
    // invalid activity/filter pair
    expect(renderFilterStatement('', '', [])).toBe('');
    expect(renderFilterStatement('nap', '', [])).toBe('');
    expect(renderFilterStatement('alcohol', '', [])).toBe('');

    // nap cases
    expect(renderFilterStatement('nap', 'yes', [])).toBe(
      'On days when I took a nap...'
    );
    expect(renderFilterStatement('nap', 'no', [])).toBe(
      "On days when I didn't take a nap..."
    );

    // timeOfDay base cases
    expect(renderFilterStatement('alcohol', '', ['AM', 'PM', 'LN', 'NA'])).toBe(
      'On days when I recorded a log...'
    );
    expect(renderFilterStatement('alcohol', '', ['NA'])).toBe(
      "On days when I didn't have alcohol..."
    );
    expect(renderFilterStatement('alcohol', '', ['AM', 'PM', 'LN'])).toBe(
      'On days when I had alcohol...'
    );

    // recursive case
    expect(renderFilterStatement('alcohol', '', ['AM', 'PM', 'NA'])).toBe(
      "On days when I had alcohol in the morning or in the afternoon/evening or when I didn't have alcohol..."
    );
    expect(renderFilterStatement('alcohol', '', ['AM', 'LN'])).toBe(
      'On days when I had alcohol in the morning or late at night...'
    );
  });
});
