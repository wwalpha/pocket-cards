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
    @State var path = [String]()

    private let gradient1 = LinearGradient(
        colors: [Color(hex: 0x2193B0), Color(hex: 0x6DD5ED)],
        startPoint: .topTrailing,
        endPoint: .bottomLeading
    )
    private let gradient2 = LinearGradient(
        colors: [Color(hex: 0xC21500), Color(hex: 0xFFC500)],
        startPoint: .topTrailing,
        endPoint: .bottomLeading
    )

    private let gradient3 = LinearGradient(
        colors: [Color(hex: 0x5D26C1), Color(hex: 0xA17FE0)],
        startPoint: .topTrailing,
        endPoint: .bottomLeading
    )

    var body: some View {
        NavigationStack(path: $path) {
            VStack(alignment: .leading, spacing: 32) {
                // 国語
                getHStack(subject: SUBJECT.LANGUAGE)

                // 社会
                getHStack(subject: SUBJECT.SOCIETY)

                // 理科
                getHStack(subject: SUBJECT.SCIENCE)

                // 英語
                getHStack(subject: SUBJECT.ENGLISH)
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbarBackground(Color.primaryColor, for: .navigationBar)
            .toolbarBackground(.visible, for: .navigationBar)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Text(APP_VERSION)
                        .accessibilityAddTraits(.isHeader)
                        .foregroundColor(Color.white)
                }
                ToolbarItem(placement: .principal) {
                    Text("Home")
                        .font(.largeTitle.bold())
                        .accessibilityAddTraits(.isHeader)
                        .foregroundColor(Color.white)
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button {
                        Auth.signOut()
                    } label: {
                        Text("Sign Out")
                            .frame(width: 120, height: 36, alignment: .center)
                            .foregroundColor(Color.white)
                    }
                }
            }
            .navigationDestination(for: String.self) { text in
                switch text {
                case "00":
                    router?.makeEnglishStudyView()
                case "01":
                    router?.makeEnglishTestView()
                case "10":
                    router?.makeLanguageStudyiew()
                case "11":
                    router?.makeLanguageTestView()
//                case "12":
//                    router?.makeLanguageReviewView()
                case "20":
                    router?.makeScienceStudyiew()
                case "21":
                    router?.makeScienceTestView()
//                case "22":
//                    router?.makeScienceReviewView()
                case "30":
                    router?.makeSocietyStudyView()
                case "31":
                    router?.makeSocietyTestView()
//                case "32":
//                    router?.makeSocietyReviewView()
                default:
                    Text("")
                }
            }
        }
    }

    func getHStack(subject: String) -> some View {
        HStack(alignment: .center, content: {
            Text(SUBJECT_TITLE[subject]!)
                .frame(height: 100, alignment: .topLeading)
                .font(.system(size: 32))
                .padding(.trailing, 64)
                .padding(.leading, 48)
            // テスト
            getButton(action: "\(subject)1", text: Consts.TEST_TITLE, background: gradient2)

            // 学習
            getButton(action: "\(subject)0", text: Consts.PRACTICE_TITLE, background: gradient1)

            // 復習
            // getButton(action: "\(subject)2", text: Consts.REVIEW_TITLE, background: gradient3)

            Spacer()
        })
        .padding(16)
        .frame(width: 900)
        .background(getLinearGradient(subject: subject))
        .clipped()
        .shadow(color: Color.black.opacity(0.3), radius: 5, x: 5, y: 5)
    }

    @ViewBuilder
    func getButton(action: String, text: String, background: LinearGradient) -> some View {
        Button {
            path.append(action)
        } label: {
            Text(text)
                .font(.system(size: 24, design: .default))
                .fontWeight(.bold)
                .frame(width: 200, height: 72, alignment: .center)
                .background(background)
                .foregroundColor(Color.white)
                .padding(.trailing, 32)
                .clipped()
                .shadow(color: Color.black.opacity(0.3), radius: 5, x: 5, y: 5)
        }
    }

    func getLinearGradient(subject: String) -> LinearGradient {
        var colors: [Color] = [Color(hex: 0xF2B0B7), Color(hex: 0xFAE3E5)]

        if subject == SUBJECT.SCIENCE {
            colors = [Color(hex: 0xF4C9B0), Color(hex: 0xFBECE4)]
        }

        if subject == SUBJECT.SOCIETY {
            colors = [Color(hex: 0xBCEAC7), Color(hex: 0xDAF4E0)]
        }

        if subject == SUBJECT.ENGLISH {
            colors = [Color(hex: 0xBCEAC7), Color(hex: 0xDAF4E0)]
        }

        return LinearGradient(
            colors: colors,
            startPoint: .topTrailing,
            endPoint: .bottomLeading
        )
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
