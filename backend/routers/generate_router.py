from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from models import User
from auth import get_current_user
from ai.code_generator import generate_react_code

router = APIRouter(prefix="/api/generate", tags=["generate"])


class GenerateRequest(BaseModel):
    ui_tree: dict
    project_name: str = "GeneratedComponent"


class GenerateResponse(BaseModel):
    code: str
    component_name: str


@router.post("", response_model=GenerateResponse)
async def generate_code(
    req: GenerateRequest,
    user: User = Depends(get_current_user),
):
    try:
        code = await generate_react_code(req.ui_tree, req.project_name)
        return GenerateResponse(code=code, component_name=req.project_name)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Code generation failed: {str(e)}")
