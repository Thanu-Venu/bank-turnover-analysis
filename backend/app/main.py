from fastapi import FastAPI

app=FastAPI(
    title="Bank Turnover Analyzer API"
)

@app.get("/")
def root():
    return{
        "message": "Bank Turnover analyzer API running successfully"
    }