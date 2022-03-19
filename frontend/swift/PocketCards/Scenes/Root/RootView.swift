//
//  RootView.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import AVFoundation
import Kingfisher
import SwiftUI

struct RootView: View {
    private var router: RootRouter?

    var body: some View {
        let gradient1 = LinearGradient(
            colors: [Color(hex: 0x2193B0), Color(hex: 0x6DD5ED)],
            startPoint: .topTrailing,
            endPoint: .bottomLeading
        )
        let gradient2 = LinearGradient(
            colors: [Color(hex: 0xC21500), Color(hex: 0xFFC500)],
            startPoint: .topTrailing,
            endPoint: .bottomLeading
        )

        VStack(alignment: .leading, spacing: 32) {
            Spacer()

            HStack {
                Text("国語")
                    .frame(height: 120, alignment: .topLeading)
                    .font(.system(size: 32))
                    .padding(.trailing, 64)

                NavigationLink(destination: router?.makeLanguageStudyiew()) {
                    Text("日々の演習")
                        .font(.system(size: 24, design: .default))
                        .fontWeight(.bold)
                        .frame(width: 200, height: 96, alignment: .center)
                        .background(gradient1)
                        .foregroundColor(Color.white)
                }
                .padding(.trailing, 32)
                .clipped()
                .shadow(color: Color.black.opacity(0.3), radius: 5, x: 5, y: 5)

                NavigationLink(destination: router?.makeLanguageTestView()) {
                    Text("日々のテスト")
                        .font(.system(size: 24, design: .default))
                        .fontWeight(.bold)
                        .frame(width: 200, height: 96, alignment: .center)
                        .background(gradient2)
                        .foregroundColor(Color.white)
                }
                .padding(.leading, 32)
                .clipped()
                .shadow(color: Color.black.opacity(0.3), radius: 5, x: 5, y: 5)

                Spacer()
            }
            .padding(32)
            .background(
                LinearGradient(
                    colors: [Color(hex: 0xF2B0B7), Color(hex: 0xFAE3E5)],
                    startPoint: .topTrailing,
                    endPoint: .bottomLeading
                )
            )
            .clipped()
            .shadow(color: Color.black.opacity(0.3), radius: 5, x: 5, y: 5)

            HStack {
                Text("社会")
                    .frame(height: 120, alignment: .topLeading)
                    .font(.system(size: 32))
                    .padding(.trailing, 64)

                NavigationLink(destination: router?.makeSocietyStudyiew()) {
                    Text("日々の演習")
                        .font(.system(size: 24, design: .default))
                        .fontWeight(.bold)
                        .frame(width: 200, height: 96, alignment: .center)
                        .background(gradient1)
                        .foregroundColor(Color.white)
                }
                .padding(.trailing, 32)
                .clipped()
                .shadow(color: Color.black.opacity(0.3), radius: 5, x: 5, y: 5)

                NavigationLink(destination: router?.makeSocietyTestView()) {
                    Text("日々のテスト")
                        .font(.system(size: 24, design: .default))
                        .fontWeight(.bold)
                        .frame(width: 200, height: 96, alignment: .center)
                        .background(gradient2)
                        .foregroundColor(Color.white)
                }
                .padding(.leading, 32)
                .clipped()
                .shadow(color: Color.black.opacity(0.3), radius: 5, x: 5, y: 5)

                Spacer()
            }
            .padding(32)
            .background(
                LinearGradient(
                    colors: [Color(hex: 0xBCEAC7), Color(hex: 0xDAF4E0)],
                    startPoint: .topTrailing,
                    endPoint: .bottomLeading
                )
            )
            .clipped()
            .shadow(color: Color.black.opacity(0.3), radius: 5, x: 5, y: 5)

            HStack {
                Text("理科")
                    .frame(height: 120, alignment: .topLeading)
                    .font(.system(size: 32))
                    .padding(.trailing, 64)

                NavigationLink(destination: router?.makeScienceStudyiew()) {
                    Text("日々の演習")
                        .font(.system(size: 24, design: .default))
                        .fontWeight(.bold)
                        .frame(width: 200, height: 96, alignment: .center)
                        .background(gradient1)
                        .foregroundColor(Color.white)
                }
                .padding(.trailing, 32)
                .clipped()
                .shadow(color: Color.black.opacity(0.3), radius: 5, x: 5, y: 5)

                NavigationLink(destination: router?.makeScienceTestView()) {
                    Text("日々のテスト")
                        .font(.system(size: 24, design: .default))
                        .fontWeight(.bold)
                        .frame(width: 200, height: 96, alignment: .center)
                        .background(gradient2)
                        .foregroundColor(Color.white)
                }
                .padding(.leading, 32)
                .clipped()
                .shadow(color: Color.black.opacity(0.3), radius: 5, x: 5, y: 5)

                Spacer()
            }
            .padding(32)
            .background(
                LinearGradient(
                    colors: [Color(hex: 0xF4C9B0), Color(hex: 0xFBECE4)],
                    startPoint: .topTrailing,
                    endPoint: .bottomLeading
                )
            )
            .clipped()
            .shadow(color: Color.black.opacity(0.3), radius: 5, x: 5, y: 5)

            Spacer()
        }.padding(.horizontal, 64)
            .navigationBarTitleDisplayMode(.inline)
            .navigationBarColor(UIColor(Color.primaryColor), UIColor(Color.white))
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Home")
                        .font(.largeTitle.bold())
                        .accessibilityAddTraits(.isHeader)
                }

                ToolbarItem(placement: .navigationBarTrailing) {
                    Button {
                        Auth.signOut()
                    } label: {
                        Text("Sign Out")
                            .frame(width: 120, height: 36, alignment: .center)
                            .foregroundColor(Color.black)
//                            .foregroundColor(Color.white)
//                            .background(Color.accent1)
                    }
                }
            }
    }
}

extension RootView {
    func configureView() -> some View {
        var view = self

        view.router = RootRouter()

        return view
    }
}

struct RootView_Previews: PreviewProvider {
    static var previews: some View {
        RootView()
            .previewInterfaceOrientation(.landscapeLeft)
    }
}
