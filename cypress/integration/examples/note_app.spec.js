describe('Note app', function() {
  beforeEach(function() {
    cy.request('POST','http://localhost:3001/api/testing/reset')
    const user = {
      username: 'Yuvi',
      name: 'Yuvaraj',
      password: 'madrid'
    }
    cy.request('POST','http://localhost:3001/api/users',user)
    cy.visit('http://localhost:3000')
  })
  it('front page can be opened', function() {
    cy.contains('Notes')
    cy.contains('Note app, Department of Computer Science, University of Helsinki 2020')
  })
  it('Login form can be opened', function() {
    cy.contains('login').click()
  })
  it('Login can be done', function() {
    cy.contains('login').click()
    cy.get('#username').type('Yuvi')
    cy.get('#password').type('madrid')
    cy.get('#login-button').click()

    cy.contains('Yuvaraj logged-in')
  })
  it('Login only with coreect credentials', function() {
    cy.contains('login').click()
    cy.get('#username').type('Yuvi')
    cy.get('#password').type('Wrong')
    cy.get('#login-button').click()

    cy.get('.error')
      .should('contain','invalid username or password')
      .and('have.css', 'color', 'rgb(255, 0, 0)')
      .and('have.css', 'font-size', '20px')

    cy.get('html').should('not.contain','Yuvaraj logged-in')
  })
  describe('when logged-in', function() {
    beforeEach(function() {
      cy.login({ username: 'Yuvi', password: 'madrid' })
    })
    it('a new note can be created', function() {
      cy.contains('new note').click()
      cy.get('#text').type('a note created by cypress')
      cy.contains('Save').click()
      cy.contains('a note created by cypress')
    })
    describe('and a note exists', function() {
      beforeEach(function(){
        cy.createNote({
          content: 'first note',
          important: false
        })
        cy.createNote({ content: 'second note', important: false })
        cy.createNote({ content: 'third note', important: false })
      })
      it('a note can be made important', function() {
        cy.contains('second note').parent()
          .find('button').as('theButton')
        cy.get('@theButton').click()
        cy.get('@theButton').should('contain','make not important')
      })
    })
  })
})