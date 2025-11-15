"use client";

import { useState, useEffect } from "react";
import { getOffices, getSites } from "@/api/speedy";
import { AddressPickerValue } from "@/types/ui"; 
import type { SpeedySite, SpeedyOffice } from "@/types/api";

type AddressPickerProps = {
    value: AddressPickerValue;
    onChange: (partial: Partial<AddressPickerValue>) => void;
};

export default function AddressPicker({ value, onChange }: AddressPickerProps) {
    const [siteQuery, setSiteQuery] = useState("");
    const [officeQuery, setOfficeQuery] = useState("");

    const [siteResults, setSiteResults] = useState<SpeedySite[]>([]);
    const [officeResults, setOfficeResults] = useState<SpeedyOffice[]>([]);

    const [showSiteResults, setShowSiteResults] = useState(false);
    const [showOfficeResults, setShowOfficeResults] = useState(false);

    const isPersonal = value.deliveryType === "personal";
    const isCourier = value.deliveryType === "courier";

    useEffect(() => {
        setSiteQuery(value.siteName ?? "");
    }, [value.siteName]);

    useEffect(() => {
        setOfficeQuery(value.officeName ?? "");
    }, [value.officeName]);

    const handleTypeChange = (newType: "personal" | "courier") => {
        const oldType = value.deliveryType;

        onChange({ deliveryType: newType });

        if (newType === "personal" && oldType !== "personal") {
            onChange({
                officeId: null,
                officeName: "",
            });
            setOfficeQuery("");
            setOfficeResults([]);
        }

        if (newType === "courier" && oldType !== "courier") {
            onChange({
                siteId: null,
                siteName: "",
                addressText: "",
            });
            setSiteQuery("");
            setSiteResults([]);
        }
    };

    const handleSiteSearch = async (query: string) => {
        setSiteQuery(query);
        onChange({ siteName: query });

        if (query.length < 3) {
            setSiteResults([]);
            setShowSiteResults(false);
            return;
        }

        const results = await getSites(query);
        setSiteResults(results);
        setShowSiteResults(true);
    };

    const handleOfficeSearch = async (query: string) => {
        setOfficeQuery(query);
        onChange({ officeName: query });

        if (query.length < 3) {
            setOfficeResults([]);
            setShowOfficeResults(false);
            return;
        }

        const results = await getOffices(query);
        setOfficeResults(results);
        setShowOfficeResults(true);
    };

    const selectSite = (site: SpeedySite) => {
        onChange({
            siteId: site.id,
            siteName: site.name,
        });
        setSiteQuery(site.name);
        setShowSiteResults(false);
    };

    const selectOffice = (office: SpeedyOffice) => {
        onChange({
            officeId: office.id,
            officeName: office.name,
        });
        setOfficeQuery(office.name);
        setShowOfficeResults(false);
    };

    return (
        <div className="space-y-4">
            {/* Address type */}
            <div>
                <label className="mb-2 block text-sm font-medium" style={{ color: "#2d2d2d" }}>
                    Тип адрес *
                </label>

                <select
                    value={value.deliveryType}
                    onChange={(e) => handleTypeChange(e.target.value as any)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:outline-none"
                    style={{ "--tw-ring-color": "#D176A3" } as React.CSSProperties}
                    required
                >
                    <option value="personal">Личен адрес</option>
                    <option value="courier">Офис на куриер</option>
                </select>
            </div>

            {isPersonal ? (
                <>
                    {/* Site */}
                    <div className="relative">
                        <label className="mb-2 block text-sm font-medium" style={{ color: "#2d2d2d" }}>
                            Населено място *
                        </label>

                        <input
                            type="text"
                            value={siteQuery}
                            onChange={(e) => handleSiteSearch(e.target.value)}
                            onFocus={() => siteQuery.length >= 3 && setShowSiteResults(true)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2"
                            style={{ "--tw-ring-color": "#D176A3" } as React.CSSProperties}
                            placeholder="Започнете да пишете..."
                            autoComplete="off"
                            required={isPersonal}
                        />

                        {showSiteResults && siteResults.length > 0 && (
                            <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border bg-white shadow-lg">
                                {siteResults.map((s) => (
                                    <button
                                        key={s.id}
                                        type="button"
                                        onClick={() => selectSite(s)}
                                        className="w-full text-left px-4 py-3 hover:bg-gray-50"
                                    >
                                        {s.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Address Text */}
                    <div>
                        <label className="mb-2 block text-sm font-medium" style={{ color: "#2d2d2d" }}>
                            Адрес *
                        </label>
                        <input
                            type="text"
                            value={value.addressText ?? ""}
                            onChange={(e) => onChange({ addressText: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2"
                            style={{ "--tw-ring-color": "#D176A3" } as React.CSSProperties}
                            placeholder="Улица, номер, етаж..."
                            required={isPersonal}
                        />
                    </div>
                </>
            ) : (
                <>
                    {/* Office */}
                    <div className="relative">
                        <label className="mb-2 block text-sm font-medium" style={{ color: "#2d2d2d" }}>
                            Офис на куриер *
                        </label>

                        <input
                            type="text"
                            value={officeQuery}
                            onChange={(e) => handleOfficeSearch(e.target.value)}
                            onFocus={() => officeQuery.length >= 3 && setShowOfficeResults(true)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2"
                            style={{ "--tw-ring-color": "#D176A3" } as React.CSSProperties}
                            placeholder="Започнете да пишете име на офис..."
                            autoComplete="off"
                            required={isCourier}
                        />

                        {showOfficeResults && officeResults.length > 0 && (
                            <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border bg-white shadow-lg">
                                {officeResults.map((o) => (
                                    <button
                                        key={o.id}
                                        type="button"
                                        onClick={() => selectOffice(o)}
                                        className="w-full text-left px-4 py-3 hover:bg-gray-50"
                                    >
                                        {o.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
