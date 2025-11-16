using AutoMapper;
using Knigarela.Api.Dtos.Boxes;
using Knigarela.Api.Dtos.Cart;
using Knigarela.Api.Dtos.Clients;
using Knigarela.Api.Dtos.Orders;
using Knigarela.Core.Entities;

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

            CreateMap<Box, BoxDto>()
                .ForMember(dest => dest.ImageUrls,
                    opt => opt.MapFrom((src, dest) =>
                        src.Images != null
                            ? src.Images
                                .Where(x => !x.IsMain)
                                .OrderBy(x => x.SortOrder)
                                .Select(i => i.Url)
                            : []))
                .ForMember(dest => dest.MainImageUrl,
                    opt => opt.MapFrom((src, dest) =>
                        src.Images?
                           .FirstOrDefault(i => i.IsMain)?
                           .Url));

            CreateMap<Box, ActiveBoxDto>()
                .ForMember(dest => dest.Description,
                    opt => opt.MapFrom((src, dest) =>
                        !string.IsNullOrEmpty(src.Description) && src.Description.Length > 200
                            ? $"{src.Description[..200]}..."
                            : src.Description))
                .ForMember(dest => dest.MainImageUrl,
                    opt => opt.MapFrom((src, dest) =>
                        src.Images?
                           .FirstOrDefault(i => i.IsMain)?
                           .Url));

            CreateMap<Box, PrevBoxDto>()
                .ForMember(dest => dest.MainImageUrl,
                    opt => opt.MapFrom((src, dest) =>
                        src.Images?
                           .FirstOrDefault(i => i.IsMain)?
                           .Url));

            CreateMap<Box, AllBoxDto>()
               .ForMember(dest => dest.Available, opt => opt.MapFrom(src => src.Count > 0))
               .ForMember(dest => dest.MainImageUrl,
                   opt => opt.MapFrom((src, dest) =>
                       src.Images?
                          .FirstOrDefault(i => i.IsMain)?
                          .Url));

            CreateMap<Order, OrderByIdDto>()
               .ForMember(dest => dest.Email,
                   opt => opt.MapFrom((src, dest) => src.Client?.Email))
               .ForMember(dest => dest.Client,
                   opt => opt.MapFrom((src, dest) => src.Client?.FullName))
               .ForMember(dest => dest.OrderNumber,
                   opt => opt.MapFrom(src => src.Id))
               .ForMember(dest => dest.Date,
                   opt => opt.MapFrom(src => src.CreatedAt))
               .ForMember(dest => dest.AddressType,
                   opt => opt.MapFrom((src, dest) => src.Address?.DeliveryTypeText))
               .ForMember(dest => dest.AddressDetailText,
                   opt => opt.MapFrom((src, dest) => src.Address?.AddressDetailText))
               .ForMember(dest => dest.SubTotal,
                   opt => opt.MapFrom(src => src.TotalAmount));

            CreateMap<OrderItem, CartItemDto>()
               .ForMember(dest => dest.BoxId,
                   opt => opt.MapFrom(src => src.BoxId))
               .ForMember(dest => dest.Title,
                   opt => opt.MapFrom((src, dest) => src.Box?.Title))
               .ForMember(dest => dest.ImageUrl,
                   opt => opt.MapFrom((src, dest) =>
                       src.Box?
                          .Images?
                          .FirstOrDefault(x => x.IsMain)?
                          .ThumbnailUrl));

            CreateMap<Client, ClientAllDto>()
               .ForMember(dest => dest.DefaultAddress,
                   opt => opt.MapFrom((src, dest) =>
                       src.Addresses?
                          .FirstOrDefault(x => x.IsDefault)?
                          .AddressDetailText));
        }
    }
}
