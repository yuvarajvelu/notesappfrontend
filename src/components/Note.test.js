import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'
import Note from './Note'
import Togglable from './Togglable'
import NoteForm from './NoteForm'

describe('<Note />',() => {
  test('renders content', () => {
    const note = {
      content: 'Component testing is done with react-testing-library',
      important: true
    }

    const mockHandler = jest.fn()
    const component = render(
      <Note note = {note} toggleImportance = {mockHandler} />
    )

    const button = component.container.querySelector('button')
    console.log(prettyDOM(button))
    fireEvent.click(button)

    expect(mockHandler.mock.calls).toHaveLength(1)

    expect(component.container).toHaveTextContent(
      'Component testing is done with react-testing-library'
    )

    const element = component.getByText(
      'Component testing is done with react-testing-library'
    )
    expect(element).toBeDefined()

    const div = component.container.querySelector('.note')
    expect(div).toHaveTextContent('Component testing is done with react-testing-library')
  })
})

describe('<Togglable />',() => {
  let component
  beforeEach(() => {
    component = render(
      <Togglable buttonLabel = 'show...'>
        <div className = "testDiv" />
      </Togglable>
    )
  })

  test('renders its children',() => {
    const div = component.container.querySelector('.testDiv')
    expect(div).toBeDefined()
  })

  test('at start the childrens are not displayed',() => {
    expect(component.container.querySelector('.togglableContent')).toHaveStyle('display: none')
  })

  test('after clicking the button the childrens are displayed',() => {
    const button = component.getByText('show...')
    fireEvent.click(button)

    const div = component.container.querySelector('.togglableContent')
    expect(div).not.toHaveStyle('display: none')
  })

  test('toggled content can be closed',() => {
    const button = component.container.querySelector('button')
    fireEvent.click(button)

    const closedButton = component.container.querySelector('button:nth-child(2)')
    fireEvent.click(closedButton)

    expect(component.container.querySelector('.togglableContent')).toHaveStyle('display:none')
  })
})

describe('<NoteForm />' ,() => {
  test('Updates parent state and calls onSubmit',() => {
    const createNote = jest.fn()

    const component = render(
      <NoteForm createNote = {createNote} />
    )
    const input = component.container.querySelector('input')
    const form = component.container.querySelector('form')

    fireEvent.change(input,{
      target: { value: 'Testing of forms could be easy' }
    })
    fireEvent.submit(form)
    expect(createNote.mock.calls).toHaveLength(1)
    expect(createNote.mock.calls[0][0].content).toBe('Testing of forms could be easy')
  })
})