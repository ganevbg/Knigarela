import Link from "next/link"
import { CheckCircle2, Package, Mail, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getOrder } from "@/api/orders"
import { ResponsiveImg } from "@/components/responsiveImg";
import { formatPrice } from "@/lib/utils"

export default async function OrderSuccessPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const order = await getOrder(id);
    const date = new Date(order.date);
    const formatted = date.toLocaleDateString("bg-BG");

    return (
        <div className="min-h-screen bg-gradient-to-b from-[var(--knigarela-bg)] to-white">
            <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
                {/* Success Icon and Message */}
                <div className="mb-12 text-center">
                    <div className="mb-6 flex justify-center">
                        <div className="rounded-full bg-[var(--knigarela-pink-light)] p-4">
                            <CheckCircle2 className="h-16 w-16 text-[var(--knigarela-pink)]" />
                        </div>
                    </div>

                    <h1 className="mb-4 text-4xl font-bold text-balance text-[var(--knigarela-text)]">
                        Благодарим за вашата поръчка!
                    </h1>

                    <p className="mx-auto max-w-2xl text-lg text-pretty text-[var(--knigarela-text-light)]">
                        Вашата поръчка е получена и скоро ще започнем да я обработваме. Ще получите имейл с потвърждение на{" "}
                        <strong>{order.email}</strong>
                    </p>
                </div>

                {/* Order Number Card */}
                <div className="mb-8 rounded-xl border-2 bg-white p-6 shadow-sm">
                    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <div>
                            <p className="text-sm text-[var(--knigarela-text-light)]">Номер на поръчка</p>
                            <p className="text-2xl font-bold text-[var(--knigarela-pink)]">{order.orderNumber}</p>
                        </div>
                        <div className="text-center sm:text-right">
                            <p className="text-sm text-[var(--knigarela-text-light)]">Дата</p>
                            <p className="text-lg font-semibold text-[var(--knigarela-text)]">{formatted}</p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Order Details - Left Column */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* What's Next Card */}
                        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-md">
                            <h2 className="mb-4 text-xl font-semibold text-[var(--knigarela-text)]">Какво следва?</h2>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--knigarela-pink-light)]">
                                            <Package className="h-5 w-5 text-[var(--knigarela-pink)]" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[var(--knigarela-text)]">Обработка на поръчката</h3>
                                        <p className="text-sm text-[var(--knigarela-text-light)]">
                                            Ще подготвим вашата книжна кутия с грижа и внимание
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--knigarela-pink-light)]">
                                            <Mail className="h-5 w-5 text-[var(--knigarela-pink)]" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[var(--knigarela-text)]">Имейл потвърждение</h3>
                                        <p className="text-sm text-[var(--knigarela-text-light)]">
                                            Ще получите детайли за поръчката и проследяване на пратката
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--knigarela-pink-light)]">
                                            <MapPin className="h-5 w-5 text-[var(--knigarela-pink)]" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[var(--knigarela-text)]">Доставка</h3>
                                        <p className="text-sm text-[var(--knigarela-text-light)]">
                                            Вашата поръчка ще пристигне в рамките на 3-5 работни дни
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Details */}
                        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-md">
                            <h2 className="mb-4 text-xl font-semibold text-[var(--knigarela-text)]">Детайли за доставка</h2>
                            <div className="space-y-2 text-[var(--knigarela-text-light)]">
                                <p>
                                    <strong className="text-[var(--knigarela-text)]">Име:</strong> {order.client}
                                </p>
                                <p>
                                    <strong className="text-[var(--knigarela-text)]">Имейл:</strong> {order.email}
                                </p>
                                <p>
                                    <strong className="text-[var(--knigarela-text)]">Тип доставка:</strong>{" "}
                                    {order.addressType}
                                </p>
                                <p>
                                    <strong className="text-[var(--knigarela-text)]">Адрес:</strong> {order.addressDetailText}
                                </p>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-md">
                            <h2 className="mb-4 text-xl font-semibold text-[var(--knigarela-text)]">Поръчани артикули</h2>
                            <div className="space-y-4">
                                {order.items.map((item: any) => (
                                    <div key={item.boxId} className="flex gap-4 border-b pb-4 last:border-b-0">
                                        <ResponsiveImg image={item.image} alt={`Product ${item.title}`} sizes={"80px"} className={"h-20 w-20 rounded-lg object-cover"} />
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-[var(--knigarela-text)]">{item.title}</h3>
                                            <p className="text-sm text-[var(--knigarela-text-light)]">{`${item.purchaseTypeText} - ${item.quantity} бр.`}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-[var(--knigarela-text)]">{formatPrice(item.unitPrice, true)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary - Right Column */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-4 rounded-xl bg-gradient-to-br from-[var(--knigarela-pink)] to-[#b85e8a] p-6 text-white shadow-lg">
                            <h2 className="mb-6 text-2xl font-bold">Обобщение</h2>

                            <div className="mb-4 space-y-4 border-b border-white/30 pb-4">
                                <div className="flex justify-between text-white/90">
                                    <span>Междинна сума</span>
                                    <span>{formatPrice(order.subTotal, true)}</span>
                                </div>
                                <div className="flex justify-between text-white/90">
                                    <span>Доставка</span>
                                    <span>{formatPrice(order.deliveryAmount, true)}</span>
                                </div>
                            </div>

                            <div className="mb-6 flex justify-between text-xl font-bold">
                                <span>Обща сума</span>
                                <span>{formatPrice(order.totalAmount, true)}</span>
                            </div>

                            <div className="space-y-3">
                                <Button
                                    asChild
                                    className="w-full bg-white font-semibold text-[var(--knigarela-pink)] hover:bg-white/90"
                                >
                                    <Link href="/all-boxes">Разгледай още кутии</Link>
                                </Button>

                                <Button
                                    asChild
                                    variant="outline"
                                    className="w-full border-2 border-white bg-transparent font-semibold text-white hover:bg-white/10"
                                >
                                    <Link href="/">Към начало</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Customer Support Note */}
                <div className="mt-12 rounded-xl border-2 bg-[var(--knigarela-bg)] p-6 text-center">
                    <p className="text-[var(--knigarela-text-light)]">
                        Имате въпроси относно вашата поръчка?{" "}
                        <a
                            href="mailto:knigarela@gmail.com"
                            className="font-semibold text-[var(--knigarela-pink)] underline hover:text-[#b85e8a]"
                        >
                            Свържете се с нас
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}
