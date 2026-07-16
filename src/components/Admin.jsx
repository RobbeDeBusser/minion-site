import React, { useState, useCallback } from "react";

export default function Admin({
  addNewSound,
  updateSound,
  deleteSound,
  toggleItemDiscount,
  addBananas,
  shopItems,
  isDiscountActive,
  setIsDiscountActive,
}) {
  const [soundName, setSoundName] = useState("");
  const [soundPrice, setSoundPrice] = useState("");
  const [soundIcon, setSoundIcon] = useState("");
  const [fileName, setFileName] = useState("Geen bestand geselecteerd");
  const [fileContent, setFileContent] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [cheatFeedback, setCheatFeedback] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [soundToDelete, setSoundToDelete] = useState(null);

  const resetForm = () => {
    setSoundName("");
    setSoundPrice("");
    setSoundIcon("");
    setFileName("Geen bestand geselecteerd");
    setFileContent(null);
    setEditingId(null);
    const fileInput = document.getElementById("admin-file-input");
    if (fileInput) fileInput.value = "";
  };

  const handleEditClick = (item) => {
    setEditingId(item.id);
    setSoundName(item.name);
    setSoundPrice(item.price);
    setSoundIcon(item.icon || "");
    setFileName("Huidig bestand behouden (of upload nieuw)");
    setFileContent(null);
    window.scrollTo(0, 0);
    setFeedback(`Bewerken: ${item.name}`);
  };

  const handleDeleteClick = (item) => {
    setSoundToDelete(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (soundToDelete) {
      deleteSound(soundToDelete.id);
      setShowDeleteModal(false);
      setSoundToDelete(null);
      setFeedback("Geluid verwijderd! 🗑️");
      setTimeout(() => setFeedback(""), 3000);
    }
  };

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.match("audio/mpeg") && !file.type.match("audio/mp3")) {
      setFileName("Bi-do! Alleen MP3-bestanden.");
      setFileContent(null);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setFileName("Bi-do! Bestand is te groot (max 10MB).");
      setFileContent(null);
      return;
    }
    setFileName(`Bezig met laden: ${file.name}...`);
    const reader = new FileReader();
    reader.onload = (e) => {
      setFileContent(e.target.result);
      setFileName(`Geselecteerd: ${file.name}`);
    };
    reader.onerror = () => {
      setFileName("Bi-do! Fout bij lezen van bestand.");
      setFileContent(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);
  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0])
      handleFile(e.dataTransfer.files[0]);
  }, []);
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
  };

  const handleSubmit = () => {
    const price = parseInt(soundPrice, 10);
    if (!soundName || !price || price <= 0) {
      setFeedback("Bi-do... Vul een geldige naam en prijs in.");
      return;
    }

    if (editingId) {
      const updateData = {
        name: soundName,
        price: price,
        icon: soundIcon || "🎵",
      };
      if (fileContent) {
        updateData.dataUrl = fileContent;
      }
      updateSound(editingId, updateData);
      setFeedback("Geluid bijgewerkt! ✅");
    } else {
      if (!fileContent) {
        setFeedback("Bi-do... Selecteer eerst een MP3-bestand.");
        return;
      }
      addNewSound(soundName, price, fileContent, soundIcon);
      setFeedback("Geluid toegevoegd! 🎉");
    }

    resetForm();
    setTimeout(() => setFeedback(""), 3000);
  };

  const handleCheat = () => {
    addBananas(500);
    setCheatFeedback("🍌 500 Bananen toegevoegd! (Sst... niet vertellen!)");
    setTimeout(() => setCheatFeedback(""), 3000);
  };

  // Emoji helper
  const handleIconChange = (e) => {
    const val = e.target.value;
    const chars = [...val];
    if (chars.length > 1) {
      setSoundIcon(chars[chars.length - 1]);
    } else {
      setSoundIcon(val);
    }
  };

  return (
    <div className="page max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-2xl border-4 border-red-500 mb-12">
        <h1 className="text-4xl font-bold text-center text-red-600 mb-6">
          {editingId ? `Bewerk "${soundName}"` : "Nieuw Geluid Toevoegen"}
        </h1>

        <div className="space-y-4 max-w-lg mx-auto">
          <div>
            {/* AANGEPAST: Max 30 tekens limiet */}
            <label className="block text-lg font-medium text-gray-700 cursor-text-banaan">
              Geluidsnaam{" "}
              <span className="text-sm text-gray-400">
                ({soundName.length}/30)
              </span>
            </label>
            <input
              type="text"
              maxLength="30" // HTML Limiet
              className="w-full mt-1 p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Bijv. 'Banaan!'"
              value={soundName}
              onChange={(e) => setSoundName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700 cursor-text-banaan">
              Icoon / Emoji (Max 1)
            </label>
            <input
              type="text"
              className="w-full mt-1 p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Bijv. 🍌"
              value={soundIcon}
              onChange={handleIconChange}
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700 cursor-text-banaan">
              Prijs (Bananen)
            </label>
            <input
              type="number"
              className="w-full mt-1 p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition"
              placeholder="5"
              min="1"
              value={soundPrice}
              onChange={(e) => setSoundPrice(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700">
              MP3 Bestand
            </label>
            <div
              id="admin-drop-zone"
              className={`admin-drop-zone mt-1 ${isDragOver ? "dragover" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() =>
                document.getElementById("admin-file-input").click()
              }
            >
              <input
                type="file"
                id="admin-file-input"
                className="hidden"
                accept=".mp3,audio/mpeg"
                onChange={handleFileChange}
              />
              <p>
                {editingId
                  ? "Sleep nieuw bestand om te vervangen"
                  : "Sleep je MP3-bestand hier naartoe"}
              </p>
            </div>
            <div className="text-center mt-4 font-semibold text-gray-600">
              {fileName}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleSubmit}
              className={`flex-1 py-3 text-white text-lg font-bold rounded-lg shadow-md transition ${
                editingId
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {editingId ? "Update Geluid" : "Voeg Toe"}
            </button>
            {editingId && (
              <button
                onClick={resetForm}
                className="px-6 py-3 bg-gray-400 text-white text-lg font-bold rounded-lg shadow-md hover:bg-gray-500 transition"
              >
                Annuleren
              </button>
            )}
          </div>
          <p
            className={`text-center font-semibold h-6 ${
              feedback.includes("Bi-do") ? "text-red-600" : "text-green-600"
            }`}
          >
            {feedback}
          </p>
        </div>
      </div>

      {/* --- LIJST SECTIE --- */}
      <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-gray-200 mb-12">
        {/* GLOBALE KORTING */}
        <div className="flex justify-center mb-8">
          <div
            className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-colors duration-300 ${
              isDiscountActive
                ? "bg-red-100 border-red-500"
                : "bg-yellow-100 border-yellow-400"
            }`}
          >
            <input
              type="checkbox"
              id="discount-toggle"
              checked={isDiscountActive}
              onChange={(e) => setIsDiscountActive(e.target.checked)}
              className="w-6 h-6 text-red-600 rounded focus:ring-red-500 border-gray-300 cursor-pointer"
            />
            <label
              htmlFor="discount-toggle"
              className={`font-bold text-xl cursor-pointer ${
                isDiscountActive ? "text-red-600" : "text-yellow-800"
              }`}
            >
              {isDiscountActive
                ? "🔥 UITVERKOOP ACTIEF! (-50%)"
                : "Zet Globale Uitverkoop Aan"}
            </label>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Beheer Geluiden ({shopItems.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shopItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <span className="text-2xl">
                  {item.icon || (item.id.startsWith("custom") ? "🎤" : "🎵")}
                </span>
                <div className="min-w-0">
                  <p className="font-bold text-gray-800 truncate">
                    {item.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <p
                      className={`text-sm font-bold ${
                        item.discounted
                          ? "text-red-500 line-through"
                          : "text-yellow-600"
                      }`}
                    >
                      {item.price} 🍌
                    </p>
                    {item.discounted && (
                      <p className="text-sm font-bold text-red-600">
                        {Math.floor(item.price / 2)} 🍌
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleItemDiscount(item.id)}
                  className={`p-2 rounded-lg transition ${
                    item.discounted
                      ? "bg-green-100 text-green-600 animate-pulse"
                      : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                  }`}
                  title="Korting Aan/Uit"
                >
                  🏷️
                </button>
                <button
                  onClick={() => handleEditClick(item)}
                  className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                  title="Bewerken"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDeleteClick(item)}
                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                  title="Verwijderen"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- CHEATS --- */}
      <div className="bg-white p-6 rounded-xl shadow-md border-2 border-red-200 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Admin Cheats 🕵️‍♂️
        </h2>
        <button
          onClick={handleCheat}
          className="px-6 py-3 bg-yellow-400 text-red-900 text-lg font-bold rounded-lg shadow-md hover:bg-yellow-500 active:bg-yellow-600 transform hover:scale-105 transition"
        >
          + 500 Bananen 🍌
        </button>
        <p className="text-center font-semibold h-6 text-green-600 mt-2">
          {cheatFeedback}
        </p>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white p-8 rounded-2xl shadow-2xl border-4 border-red-500 max-w-sm w-full text-center transform scale-100 transition-transform">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Weet je het zeker?
            </h3>
            <p className="text-gray-600 mb-6">
              Wil je{" "}
              <span className="font-bold text-red-600">
                "{soundToDelete?.name}"
              </span>{" "}
              echt verwijderen?
              <br />
              Iedereen die dit gekocht heeft, is het kwijt!
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-6 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300"
              >
                Nee, bewaar
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700"
              >
                Ja, weg ermee!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
