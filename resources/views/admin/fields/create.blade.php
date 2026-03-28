<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Add New Field of Work') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    <form action="{{ route('fields.store') }}" method="POST" style="max-width: 600px;">
                        @csrf
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; font-weight: bold; margin-bottom: 5px;">Field Name</label>
                            <input type="text" name="name" required style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" value="{{ old('name') }}">
                            @error('name') <span style="color: red;">{{ $message }}</span> @enderror
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; font-weight: bold; margin-bottom: 5px;">Description (Guidelines for AI)</label>
                            <textarea name="description" rows="5" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">{{ old('description') }}</textarea>
                            @error('description') <span style="color: red;">{{ $message }}</span> @enderror
                        </div>
                        <button type="submit" style="padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">Save Field</button>
                        <a href="{{ route('fields.index') }}" style="margin-left: 15px; color: #555; text-decoration: none;">Cancel</a>
                    </form>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
