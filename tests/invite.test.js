const test = require('supertest')
const app = require('../index')
const { omit } = require('lodash')
const request = require('superagent')
const mocker = require('superagent-mocker')

const mock = mocker(request)

function resolveAllPromises() {
  return new Promise((resolve) => setTimeout(resolve))
}

describe('invite endpoint', () => {
  let slackInviteSpy
  let githubSearchSpy
  let githubOrgInviteSpy
  let response

  beforeEach(async () => {
    slackInviteSpy = jest.fn((req) => ({
      body: {ok: true}
    }));

    githubSearchSpy = jest.fn((req) => ({
      body: {items: [{login: 'rikukissa'}]}
    }));

    githubOrgInviteSpy = jest.fn((req) => ({
      body: {user: {login: 'rikukissa'}}
    }));

    mock.post('https://koodiklinikka.slack.com/api/users.admin.invite', slackInviteSpy);
    mock.get('https://api.github.com/search/users', githubSearchSpy);
    mock.put('https://api.github.com/orgs/koodiklinikka/memberships/:login', githubOrgInviteSpy);

    response = await test(app)
      .post('/invites')
      .send({email: 'test@example.com'})
      .expect(200)

    await resolveAllPromises()
  })
  afterEach(() => mock.clearRoutes())

  it("responds with 200 status", () => {
    expect({
      headers: omit(response.headers, 'date'),
      body: response.body,
      status: response.status
    }).toMatchSnapshot()
  })

  it("send an invite request to slack's api", () => {
    expect(slackInviteSpy).toHaveBeenCalled()
    expect(slackInviteSpy.mock.calls[0][0]).toMatchSnapshot();
  })

  it('tries searching for the user from github API', () => {
    expect(githubSearchSpy).toHaveBeenCalled()
    expect(githubSearchSpy.mock.calls[0][0]).toMatchSnapshot();
  })

  it('invites user to github org', () => {
    expect(githubOrgInviteSpy).toHaveBeenCalled()
    expect(githubOrgInviteSpy.mock.calls[0][0]).toMatchSnapshot();
  })
})
