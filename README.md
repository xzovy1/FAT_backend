# Testing Dashboard

## Goals:

### Dashboard
- see upcoming water tests
- units in progress and completed/signed off.
- take data from FAT to list top issues. 

### FAT documents
- create new FAT
- save FAT to pdf so it can be uploaded to N: drive.
- stores JSON from frontend into DB


## Routes

`/home`: user dashboard
- GET:
    - displays:
        - next Full Water tests
        - Most commons deficiencies
        - units in progress
        - recently signed off
        - job numbers
`/home/job`:
- PUT: updates upcoming jobs
`/home/deficiencies`:
- PUT: updates top deficiencies
`home/inprogress`
- PUT: updates units in testing
`home/completed`
- PUT: updates units complete
`home/FWT`
- PUT: updates upcoming Full water


`'/forms/:job/:unit`: 
- GET: loads functionality
- POST: creates new functionality
- PUT: Updates functionality 

## To do:
- Build dashboard
    - data visualization with [D3.js](https://d3js.org/)
- Build FAT
    - use [puppeteer](https://pptr.dev/guides/pdf-generation) to download FAT as PDF. 
    - 