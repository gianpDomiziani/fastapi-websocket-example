from fastapi import FastAPI, WebSocket
import random

# Create application
app = FastAPI(title='WebSocket Example')

@app.websocket('/ws')
async def websocket_endpoint(websocket: WebSocket):
    print('A new websocket to create.')
    await websocket.accept()
    while True:
        try:
            # Wait for any message from the client
            await websocket.receive_text()
            # Send msg to the client
            resp = {'value': random.uniform(0,1)}
            await websocket.send_json(resp)
        except Exception as e:
            print(f'error: {e}')
            break
    print('>connection ended..')
