const requester = (input) => {
  return new Promise((resolve, reject) => {
    const chain = input.chain
    const limit = input.limit
    const data = input.data
    const requester = input.requester
    const processor = input.processor

    const chainLen = chain.length < limit ? chain.length : limit

    const shortChain = []

    for(let i = 0; i < chainLen; ++i) {
      shortChain.push(requester(chain.pop()))
    }

    Promise.all(shortChain)
      .then(resolveData => {
        const newData = processor(resolveData, data)

                resolve({
                    chain,
                    limit,
                    data: newData,
                    requester,
                    processor,
                })
            })
            .catch(err => {
                console.log(err)
                console.log(`Failed: retrying ${shortChain.length} endpoints`)

        let retry = input.retry || 10

        if(retry === 0) {
          reject(new Error('Requester tried too many times'))
        }

        resolve({
          chain,
          limit,
          data,
          requester,
          processor,
          retry: --retry,
        })
      })
  }).then(data => {
    if(data.chain.length === 0) {
      return data.data
    }

    return requester(data)
  })
}

export default requester