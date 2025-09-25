import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      prompt,
      width = 512,
      height = 512,
      steps = 20,
      guidance_scale = 7.5,
      seed = -1,
      negative_prompt = "",
    } = body;

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    try {
      const response = await generateWithHuggingFace({
        prompt,
        negative_prompt,
        width,
        height,
        num_inference_steps: steps,
        guidance_scale,
        seed: seed === -1 ? Math.floor(Math.random() * 1000000) : seed,
      });

      if (response) {
        return NextResponse.json({
          image: response,
          prompt,
          settings: { width, height, steps, guidance_scale, seed },
        });
      }
    } catch (error) {
      console.error("Hugging Face API failed :", error);
    }
  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate image. Please try again." },
      { status: 500 }
    );
  }
}

async function generateWithHuggingFace(params) {
  let HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

  if (!HF_API_KEY) {
    throw new Error('Hugging Face API key not configured')
  }

  const response = await fetch(
    "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
    {
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        inputs: params.prompt,
        parameters: {
          negative_prompt: params.negative_prompt,
          width: params.width,
          height: params.height,
          num_inference_steps: params.num_inference_steps,
          guidance_scale: params.guidance_scale,
          seed: params.seed,
        },
      }),
    }
  );

  console.log("response : ", response);

  if (!response) {
    throw new Error(`Hugging Face API error: ${response.status}`);
  }

  const imageBuffer = await response.arrayBuffer();
  const base64Image = Buffer.from(imageBuffer).toString("base64");
  return `data:image/png;base64,${base64Image}`;
}
