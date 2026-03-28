<?php

namespace App\Http\Controllers;

use App\Models\FieldOfWork;
use Illuminate\Http\Request;

class FieldOfWorkController extends Controller
{
    public function index()
    {
        $fields = FieldOfWork::all();
        return view('admin.fields.index', compact('fields'));
    }

    public function create()
    {
        return view('admin.fields.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        FieldOfWork::create($validated);

        return redirect()->route('fields.index')->with('success', 'Field of work created successfully.');
    }

    public function edit(FieldOfWork $field)
    {
        return view('admin.fields.edit', compact('field'));
    }

    public function update(Request $request, FieldOfWork $field)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $field->update($validated);

        return redirect()->route('fields.index')->with('success', 'Field of work updated successfully.');
    }

    public function destroy(FieldOfWork $field)
    {
        $field->delete();
        return redirect()->route('fields.index')->with('success', 'Field of work deleted successfully.');
    }
}
