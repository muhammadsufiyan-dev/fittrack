import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { rangeOf, shift, todayOf } from '../src/utils/dates.js'
import { isDate, isImage, isTime, num, optNum, tags } from '../src/utils/fields.js'

describe('fields', () => {
  it('checks dates and times', () => {
    assert.equal(isDate('2026-11-22'), true)
    assert.equal(isDate('22-11-2026'), false)
    assert.equal(isDate('2026-13-40'), false)
    assert.equal(isTime('18:30'), true)
    assert.equal(isTime('25:00'), false)
  })

  it('reads numbers', () => {
    assert.equal(num('12'), 12)
    assert.equal(num(''), 0)
    assert.throws(() => num('abc'))
    assert.throws(() => num(-5))
    assert.equal(optNum(''), null)
    assert.equal(optNum('7.5'), 7.5)
  })

  it('cleans tags', () => {
    assert.deepEqual(tags(['chest', 'chest', ' legs ', '']), ['chest', 'legs'])
    assert.deepEqual(tags('nope'), [])
  })

  it('accepts only image data urls', () => {
    assert.equal(isImage(''), true)
    assert.equal(isImage('data:image/png;base64,AAAA'), true)
    assert.equal(isImage('https://example.com/a.png'), false)
    assert.equal(isImage('data:text/html;base64,AAAA'), false)
  })
})

describe('dates', () => {
  it('shifts days', () => {
    assert.equal(shift('2026-11-22', -6), '2026-11-16')
    assert.equal(shift('2026-12-31', 1), '2027-01-01')
  })

  it('reads the range and today from the query', () => {
    assert.equal(rangeOf({ days: '7' }), 7)
    assert.equal(rangeOf({ days: '9999' }), 30)
    assert.equal(rangeOf({}), 30)
    assert.equal(todayOf({ today: '2026-11-22' }), '2026-11-22')
    assert.equal(todayOf({ today: 'x' }), new Date().toISOString().slice(0, 10))
  })
})
