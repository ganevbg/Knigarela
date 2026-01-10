using AutoMapper;
using Knigarela.Api.Dtos.Boxes;
using Knigarela.Api.Dtos.Cart;
using Knigarela.Api.Dtos.Clients;
using Knigarela.Api.Dtos.Orders;
using Knigarela.Core.Entities;
using Knigarela.Core.Entities.Speedy.Shipment;
using Knigarela.Core.Enums;
using Speedy.Models;
using static Dapper.SqlMapper;

namespace Knigarela.Api.Mapping
{
    public class MappingConfiguration : Profile
    {
        public MappingConfiguration()
        {
            CreateMap<UpsertBoxDto, Box>();
            CreateMap<UpsertClientDto, Client>().ReverseMap();
            CreateMap<UpsertClientAddressDto, ClientAddress>().ReverseMap();
            CreateMap<Box, AdminBoxDto>();
            CreateMap<OrderAddress, ClientAddress>();

            CreateMap<Box, BoxDto>()
                .ForMember(dest => dest.ImageUrls,
                    opt => opt.MapFrom((src, dest) =>
                        src.Images != null
                            ? src.Images
                                .OrderBy(x => x.SortOrder)
                                .Select(i => i.Url)
                            : []))
                .ForMember(dest => dest.MainImage,
                    opt => opt.MapFrom((src, dest) =>
                        src.Images?
                           .FirstOrDefault(i => i.IsMain)));

            CreateMap<Box, ActiveBoxDto>()
                .ForMember(dest => dest.Description,
                    opt => opt.MapFrom((src, dest) =>
                        !string.IsNullOrEmpty(src.Description) && src.Description.Length > 200
                            ? $"{src.Description[..200]}..."
                            : src.Description))
                .ForMember(dest => dest.MainImage,
                    opt => opt.MapFrom((src, dest) =>
                        src.Images?
                           .FirstOrDefault(i => i.IsMain)));

            CreateMap<Box, PrevBoxDto>()
                .ForMember(dest => dest.MainImage,
                    opt => opt.MapFrom((src, dest) =>
                        src.Images?
                           .FirstOrDefault(i => i.IsMain)));

            CreateMap<Box, AllBoxDto>()
               .ForMember(dest => dest.Available, opt => opt.MapFrom(src => src.Count > 0))
               .ForMember(dest => dest.MainImage,
                   opt => opt.MapFrom((src, dest) =>
                       src.Images?
                          .FirstOrDefault(i => i.IsMain)));

            CreateMap<Order, OrderByIdDto>()
               .ForMember(dest => dest.Email,
                   opt => opt.MapFrom((src, dest) => src.Client?.Email))
               .ForMember(dest => dest.Client,
                   opt => opt.MapFrom((src, dest) => src.Client?.FullName))
               .ForMember(dest => dest.Date,
                   opt => opt.MapFrom(src => src.CreatedAt))
               .ForMember(dest => dest.AddressType,
                   opt => opt.MapFrom((src, dest) => src.Address?.DeliveryTypeText))
               .ForMember(dest => dest.AddressDetailText,
                   opt => opt.MapFrom((src, dest) => src.Address?.AddressDetailText))
               .ForMember(dest => dest.SubTotal,
                   opt => opt.MapFrom(src => src.TotalAmount));

            CreateMap<Order, AdminOrderDto>()
            .ForMember(dest => dest.Email,
                opt => opt.MapFrom((src, dest) => src.Client?.Email))
            .ForMember(dest => dest.FullName,
                opt => opt.MapFrom((src, dest) => src.Client?.FullName))
            .ForMember(dest => dest.Phone,
                opt => opt.MapFrom((src, dest) => src.Client?.Phone));

            CreateMap<OrderItem, OrderItemDto>()
                .ForMember(dest => dest.BoxId,
                   opt => opt.MapFrom((src, dest) => src.Box?.Id))
                 .ForMember(dest => dest.Price,
                   opt => opt.MapFrom((src, dest) => src.UnitPrice))
               .ForMember(dest => dest.BoxTitle,
                   opt => opt.MapFrom((src, dest) => src.Box?.Title));

            CreateMap<OrderItem, CartItemDto>()
               .ForMember(dest => dest.BoxId,
                   opt => opt.MapFrom(src => src.BoxId))
               .ForMember(dest => dest.Title,
                   opt => opt.MapFrom((src, dest) => src.Box?.Title))
               .ForMember(dest => dest.Image,
                   opt => opt.MapFrom((src, dest) =>
                       src.Box?
                          .Images?
                          .FirstOrDefault(x => x.IsMain)));

            CreateMap<Client, ClientAllDto>()
               .ForMember(dest => dest.DefaultAddress,
                   opt => opt.MapFrom((src, dest) =>
                       src.Addresses?
                          .FirstOrDefault(x => x.IsDefault)));

            CreateMap<Order, OrderListDto>()
               .ForMember(dest => dest.ClientName,
                   opt => opt.MapFrom((src, dest) => src.Client?.FullName))
               .ForMember(dest => dest.Address,
                   opt => opt.MapFrom((src, dest) => src.Address?.AddressDetailText))
               .ForMember(dest => dest.Date,
                   opt => opt.MapFrom(src => src.CreatedAt))
               .ForMember(dest => dest.TotalAmount,
                   opt => opt.MapFrom(src => (src.DeliveryAmount.HasValue ? src.DeliveryAmount.Value + src.TotalAmount : src.TotalAmount)));

            CreateMap<Order, CreateShipmentRequest>()
            .ForMember(d => d.Id, opt => opt.Ignore())
            .ForMember(d => d.Service, opt => opt.Ignore())
            .ForMember(d => d.Sender, opt => opt.Ignore())
            .ForMember(d => d.Recipient, opt => opt.MapFrom(src => src))
            .ForMember(d => d.Content, opt => opt.MapFrom(src => src))
            .ForMember(d => d.Payment, opt => opt.MapFrom(src => src));

            CreateMap<Order, ShipmentRecipient>()
                .ForMember(d => d.ClientId, opt => opt.Ignore())
                .ForMember(d => d.ClientName, opt => opt.MapFrom(src => src.Client!.FullName))
                .ForMember(d => d.Phone1, opt => opt.MapFrom(src => new ShipmentPhoneNumber { Number = src.Client!.Phone }))
                .ForMember(d => d.Address, opt => opt.MapFrom(src => src.Address))
                .ForMember(d => d.PickupOfficeId, opt => opt.MapFrom(src => src.Address!.DeliveryType == DeliveryType.Courier ? src.Address.OfficeId : null));

            CreateMap<OrderAddress, ShipmentAddress>()
                .ForMember(d => d.SiteId, opt => opt.MapFrom(src => src.SiteId))
                .ForMember(d => d.SiteName, opt => opt.Ignore())
                .ForMember(d => d.AddressNote, opt => opt.MapFrom(src => src.AddressText));

            CreateMap<Order, ShipmentContent>()
                .ForMember(d => d.ParcelsCount, opt => opt.MapFrom(src => src.Items!.Sum(i => i.Quantity)))
                .ForMember(d => d.TotalWeight, opt => opt.MapFrom(src => src.Items!.Sum(i => i.Quantity * 1m)))
                .ForMember(d => d.Package, opt => opt.MapFrom(src => $"Кутия в плик"))
                .ForMember(d => d.Contents, opt => opt.MapFrom(src => $"Книжна кутия / Поръчка #{src.OrderNumber}"));

            CreateMap<Order, ShipmentPayment>()
                .ForMember(d => d.CourierServicePayer, opt => opt.MapFrom(src => ShipmentRole.RECIPIENT));

            CreateMap<CreateOrderFromCartRequest, Client>()
              .ForMember(d => d.FullName, opt => opt.MapFrom(src => src.FullName))
              .ForMember(d => d.Email, opt => opt.MapFrom(src => src.Email))
              .ForMember(d => d.Phone, opt => opt.MapFrom(src => src.Phone))
              .ForMember(d => d.SubscriptionDate, opt => opt.MapFrom(src => DateOnly.FromDateTime(DateTime.UtcNow)))
              .ForMember(d => d.Addresses, opt => opt.MapFrom(src => new List<BaseAddress> { src.Address }));

            CreateMap<BoxImage, BoxImageDto>();

        }
    }
}
