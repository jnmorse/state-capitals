const search = document.getElementById('search')
const matchList = document.getElementById('match-list')

search.addEventListener('input', () => searchStates(search.value))

async function searchStates(searchString) {
  if (searchString.length === 0) {
    matchList.innerHTML = ''
    return null
  }

  try {
    const response = await fetch('../data/state_capitals.json')

    if (response.ok) {
      const states = await response.json()

      let matches = states.filter(state => {
        const regex = new RegExp(`^${searchString}`, 'gi')

        return state.name.match(regex) || state.abbr.match(regex)
      })

      const output = getOutput(matches)
      const current = getCurrent()

      const diff = getDiff(output, current)

      diff.map($fun => $fun(matchList))
    }

    return null
  } catch (error) {
    console.error(error)
  }
}

function getDiff(output, current) {
  const results = []

  if (current.length === 0) {
    return output.map(child => $node => $node.appendChild(child.node))
  }

  for (item of current) {
    const found = output.filter(cOutput => item.key === cOutput.key)

    if (!found.length) {
      const fItem = { ...item }

      results.push($node => {
        $node.removeChild(fItem.node)
      })
    }
  }

  return results
}

function getCurrent() {
  return Array.from(matchList.childNodes).map(node => ({
    key: node.id,
    node
  }))
}

function getOutput(matches) {
  return matches.map(state => {
    const cardDiv = document.createElement('div')
    cardDiv.classList.add('card', 'card-body')
    cardDiv.id = state.abbr

    const cardHeader = document.createElement('h4')
    const cardHeaderText = document.createTextNode(`${state.name} (${state.abbr}) `)
    const cardHeaderSpan = document.createElement('span')
    cardHeaderSpan.classList.add('text-primary')

    const cardHeaderSpanText = document.createTextNode(`${state.capital}`)

    cardHeaderSpan.appendChild(cardHeaderSpanText)
    cardHeader.appendChild(cardHeaderText)
    cardHeader.appendChild(cardHeaderSpan)

    cardDiv.appendChild(cardHeader)

    return {
      key: state.abbr,
      node: cardDiv
    }
  })
}