//
//  WeeklyTestView.swift
//  PocketCards
//
//  Created by macmini on 2022/04/24.
//
//

import SwiftUI

struct WeeklyTestView: View {
    var interactor: WeeklyTestBusinessLogic?

    @ObservedObject var viewModel = WeeklyTestViewModel()

    var body: some View {
        VStack {
            if viewModel.isLoading {
                Text("Loading....").onAppear {
                    Task {
                        await interactor?.initialize()
                    }
                }
            } else if viewModel.isFinish {
                Text("テストは終わりました")
                    .font(.system(size: 64, design: .default))
            } else {
                if viewModel.question?.choices != nil {
                    ChoiceQuestion(
                        question: viewModel.question!,
                        isShowError: viewModel.isShowError,
                        onChoice: interactor!.onChoice
                    )
                } else {
                    // Society or Science
                    FlashCard(question: viewModel.question!, action: interactor!.onAction)
                }
            }
        }.onDisappear {
            viewModel.isLoading = true
            interactor?.destory()
        }
    }
}

extension WeeklyTestView: WeeklyTestDisplayLogic {
    func onUpdate(model: WeeklyTestViewModel) {
        DispatchQueue.main.async {
            viewModel.isLoading = model.isLoading
            viewModel.isFinish = model.isFinish
            viewModel.isShowError = model.isShowError
        }
    }

    func showNext(model: WeeklyTestViewModel) {
        DispatchQueue.main.async {
            viewModel.question = model.question
        }
    }
}

extension WeeklyTestView {
    func configureView(subject: String) -> some View {
        var view = self
        let interactor = WeeklyTestInteractor(loadUrl: URLs.STUDY_WEEKLY_QUESTIONS, subject: subject)
        let presenter = WeeklyTestPresenter()

        view.interactor = interactor
        interactor.presenter = presenter
        presenter.view = view

        view.viewModel.isLoading = true

        return view
    }
}

struct WeeklyTestView_Previews: PreviewProvider {
    static var previews: some View {
        WeeklyTestView()
            .previewInterfaceOrientation(.landscapeLeft)
    }
}
