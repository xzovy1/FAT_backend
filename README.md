# Testing Dashboard

## Goals:
- Web dashboard and API to manage Functional Acceptance Tests (FAT) / Full Water Tests (FWT).
- Store frontend JSON forms, generate printable PDFs, and surface dashboards for upcoming tests, in-progress units and common deficiencies.

### Dashboard
- see upcoming water tests
- units in progress and completed/signed off.
- take data from FAT to list top issues. 

### FAT documents
- create new FAT
- save FAT to pdf so it can be uploaded to N: drive.
- stores JSON from frontend into DB

## Tech Stack
- Backend: Node / Express
- DB: PostgreSQL
- PDF Generation: Puppeteer
- Frontend: React


## Schema
#### Tables
- Job numbers
    - job_number (table_id)
    - status (not started, started, in progress, complete)
    - controller_manufacterer (ALC, Siemens, Honeywell, etc.)
    - units_complete
    - unit_id
- Unit
    - id
    - job_number_id
    - technicians_id
    - additional workers
    - start datetime
    - end datetime
    - test_points_id
    - comments_id
    - signed_off (boolean)
    - conditional_status
    - test type (full water/ bypass)
    - rinse cycles
    - carryover attempts
- Test Points
    - id
    - status (pass, fail, incomplete)
    - title
    - description
    - measured
    - job_id
    - section_id
    - unit_id
- Technicians
    - id
    - name
    - signature
- Comments/Issues
    - id
    - body
    - author_id
    - point_id
    - category
    - fixed (boolean)
    - unit_id
    - datetime

    

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