import Prompt from "@models/prompt";
import { connectDB } from "@utils/database";

// GET /api/prompt/:id
export const GET = async (request, { params }) => {
    try {
        await connectDB()

        const prompt = await Prompt.findById(params.id).populate("creator")
        if (!prompt) return new Response("Prompt Not Found", { status: 404 });

        return new Response(JSON.stringify(prompt), { status: 200 })

    } catch (error) {
        return new Response("Internal Server Error", { status: 500 });
    }
}

// PATCH update a prompt
export const PATCH = async (request, { params }) => {
    const { prompt, tag } = await request.json();

    try {
        await connectDB();

        // Find the existing prompt by ID
        const existingPrompt = await Prompt.findById(params.id);

        if (!existingPrompt) {
            return new Response("Prompt not found", { status: 404 });
        }

        // Update the prompt with new data
        existingPrompt.prompt = prompt;
        existingPrompt.tag = tag;

        await existingPrompt.save();

        return new Response(JSON.stringify(existingPrompt), { status: 200 });
    } catch (error) {
        return new Response("Error Updating Prompt", { status: 500 });
    }
};


// DELETE /api/prompt/:id
export const DELETE = async (request, { params }) => {
    try {
        console.log(params.id);
        await connectDB();
        // Find the prompt by ID and remove it
        const deletedPrompt = await Prompt.findOneAndDelete({ _id: params.id });

        if (!deletedPrompt) {
            return new Response("Prompt not found", { status: 404 });
        }

        return new Response("Prompt deleted successfully", { status: 200 });
    } catch (error) {
        return new Response("Error deleting prompt", { status: 500 });
    }
};